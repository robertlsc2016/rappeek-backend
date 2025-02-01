import Axios from "../axios/axiosInstance";
import db from "../createDatabase";
import { filterProducts } from "../utils/filterProducts";

import { filterNewProducts } from "../utils/filterNewProducts";
import { IStoreProductOffer } from "../interfaces/IStoreProductOffer";
import { IConfigs } from "../interfaces/IConfigs";
import axios from "axios";
import { IProduct } from "../interfaces/IProduct";
const _ = require("lodash");
const cheerio = require("cheerio");

export class StoreService {
  static async getInfoStoreService({ store_id }: { store_id: number }) {
    const { data } = await Axios.get(
      `https://services.rappi.com.br/api/web-gateway/web/stores-router/id/${store_id}/`
    );

    return data;
  }

  static async getAllStoreProductOffers({
    configs,
    onlyRead = false,
  }: {
    onlyRead: boolean;
    configs: IConfigs;
    firstRequestDay: boolean;
  }): Promise<IStoreProductOffer | any> {
    const base_url =
      "https://services.rappi.com.br/api/web-gateway/web/dynamic/context/content/";

    try {
      const contexts = [
        { context: "sub_aisles", limit: 100 },
        { context: "store_home", limit: 100 },
      ];

      const results = await Promise.all(
        contexts.map(async (context) => {
          return (
            (await Axios.post(
              base_url,
              {
                state: configs.state,
                stores: [configs.stores[0]],
                context: context.context,
                limit: context.limit,
              },
              { timeout: 10000 }
            )) || []
          );
        })
      );

      if (results[0].status == 204) {
        return {
          status: 204,
          message: "está lojá não existe na base de dados da rappi",
        };
      }

      const [list1, list2] = results;

      const filteredProductsList1 = await filterProducts(list1.data.data, 0);
      const filteredProductsList2 = await filterProducts(list2.data.data, 3);

      const allProducts = [...filteredProductsList1, ...filteredProductsList2];

      const uniqueProducts = _.uniqBy(allProducts, "id").filter(
        (product: any) => product.discount > 0
      );

      if (uniqueProducts.length === 0) {
        return {
          store_id: configs.stores[0],
          products_count: 0,
          all: [],
          80: [],
          60: [],
          40: [],
          10: [],
          0: [],
        };
      }

      db.transaction(() => {
        // Deleta produtos existentes para a loja
        db.prepare(`DELETE FROM products WHERE store_id = ?`).run(
          configs.stores[0]
        );

        // Prepara a Instrução de Inserção
        const insertProduct = db.prepare(`
        INSERT OR REPLACE INTO products (
          id, store_id, product_id, name, price, discount, real_price, image_url, 
          quantity, unit_type, pum, stock, navigation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

        // Inserção em Lote de Produtos
        const insertMany = db.transaction((products: IProduct[]) => {
          for (const product of products) {
            insertProduct.run(
              product.id,
              configs.stores[0],
              product.product_id,
              product.name,
              product.price,
              product.discount,
              product.real_price,
              product.image_url,
              product.quantity,
              product.unit_type,
              product.pum,
              product.stock,
              JSON.stringify(product.navigation) // Considere otimizar o armazenamento, se possível
            );
          }
        });

        insertMany(uniqueProducts);

        // if (!onlyRead) {

        //   const insertStoreProducts = db.prepare(`
        //   INSERT OR REPLACE INTO storeProducts (store_id, array_products_string)
        //   VALUES (?, ?)
        // `);

        //   insertStoreProducts.run(
        //     configs.stores[0],
        //     JSON.stringify(uniqueProducts)
        //   );
        // }
      })();

      const productsStmt = db.prepare(`
      SELECT *, 
        CASE 
          WHEN discount >= 0.8 THEN 80
          WHEN discount >= 0.6 THEN 60
          WHEN discount >= 0.4 THEN 40
          WHEN discount >= 0.1 THEN 10
          ELSE 0
        END AS discount_range
      FROM products
      WHERE store_id = ? AND discount > 0
      ORDER BY discount DESC
    `);

      const products: any = productsStmt.all(configs.stores[0]);

      const rangeProducts: any = {
        store_id: configs.stores[0],
        products_count: products.length,
        all: products,
        80: [],
        60: [],
        40: [],
        10: [],
        0: [],
      };

      for (const product of products) {
        rangeProducts[product.discount_range].push(product);
      }

      return rangeProducts;
    } catch (error) {
      console.error("Erro em getAllStoreProductOffers:", error);
      throw error;
    }
  }

  static async getNewProductsStore({ configs }: { configs: IConfigs }) {
    const newProducts = await filterNewProducts({
      configs: configs,
    });

    return newProducts;
  }

  static getAllProductsDayByIdStore = async ({
    store_id,
  }: {
    store_id: number;
  }): Promise<IStoreProductOffer | { error: string } | []> => {
    if (!store_id) {
      return { error: "O parâmetro store_id é obrigatório." };
    }

    const stmt = db.prepare(`SELECT * FROM storeProducts WHERE store_id = ?`);
    const products = stmt.get(store_id);

    if (!products) {
      return [];
    }

    return products as IStoreProductOffer;
  };

  static async globalSearchProducts({
    query,
    lat,
    lng,
  }: {
    query: string;
    lat: any;
    lng: any;
  }) {
    const base_url = `https://services.rappi.com.br/api/pns-global-search-api/v1/unified-search?is_prime=true&unlimited_shipping=true`;

    const getGlobalProducts: any = await Axios.post(base_url, {
      params: { is_prime: true, unlimited_shipping: true },
      tiered_stores: [],
      lat: lat,
      lng: lng,
      query: query,
      options: {},
    });

    const filteredArray = getGlobalProducts.data.stores.map((store: any) => ({
      id: store.store_id,
      name: store.store_name,
      store_image: store.logo,
      products: store.products
        .filter(
          (product: any) =>
            product.id &&
            product.name &&
            product.image &&
            product.balance_price &&
            product.real_price &&
            product.price &&
            product.unit_type &&
            product.quantity &&
            product.stock
        )
        .sort((a: any, b: any) => a.price - b.price) // Ordena pelo preço (do mais barato ao mais caro)
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          balance_price: product.balance_price,
          real_price: product.real_price,
          price: product.price,
          unit_type: product.unit_type,
          quantity: product.quantity,
          stock: product.stock,
        })),
    }));

    return filteredArray;
  }

  static searchLocations = async ({ query }: { query: string }) => {
    try {
      const { data: locations } = await Axios.get(
        `https://services.rappi.com.br/api/ms/address/autocomplete?lat=0&lng=0&text=${query}&source=locationservices`
      );

      const filterLocations = locations.map(
        ({ main_text, secondary_text, place_id, source }: any) => {
          const data = {
            address: main_text,
            secondary_address: secondary_text,
            place_id: place_id,
            source: source,
          };

          return data;
        }
      );

      return filterLocations;
    } catch (err) {
      return err;
    }
  };

  static getGeolocation = async ({ place_id }: { place_id: string }) => {
    try {
      const { data: location } = await Axios.get(
        `https://services.rappi.com.br/api/ms/address/place-details?placeid=${place_id}&source=locationservices&raw=false&strictbounds=true`
      );

      const filterLocation = {
        address: location.original_text,
        geolocation: {
          lat: location.location[0],
          lng: location.location[1],
        },
      };

      return filterLocation;
    } catch (err) {
      return err;
    }
  };

  static getStoresByLocation = async ({
    lat,
    lng,
  }: {
    lat: string;
    lng: string;
  }) => {
    try {
      const data = await Axios.post(
        `https://services.rappi.com.br/api/web-gateway/web/dynamic/context/content`,
        {
          limit: 2,
          offset: 0,
          context: "store_category_index",
          state: {
            parent_store_type: "market",
            lat: lat,
            lng: lng,
            category: "",
          },
        }
      );

      if (data.status == 204) {
        return {
          status: 204,
          message: "não existem lojas dispoíveis para sua localidade",
        };
      }

      const stract_stores = data.data.data.context_info.stores;

      const filteredStores = stract_stores.map(
        ({
          store_id,
          name,
          store_type,
          image,
          sub_group,
          parent_store_type,
        }: any) => ({
          store_id,
          store_name: name,
          store_type: store_type,
          store_img: image,
          sub_group: sub_group,
          parent_store_type: parent_store_type,
        })
      );

      const groupMapping = {
        turbo: "turbo",
        mercados: "super",
        farmacias: "farmacia",
        presentes: "regalos",
        especializadas: "especializada",
        shopping: "hogar",
        bebidas: "licores",
        flores: "floristeria",
        express: "express",
      };

      const stores_by_group = Object.fromEntries(
        Object.entries(groupMapping).map(([key, value]) => [
          key,
          filteredStores.filter(
            (store: any) => store.sub_group.toLowerCase() === value
          ),
        ])
      );

      return stores_by_group;
    } catch (err) {
      throw new Error("Failed to fetch stores by location.");
    }
  };

  static getSimilarOnAmazon = async ({
    product_name,
  }: {
    product_name: string;
  }) => {
    const proxyUrl = "https://proxy.corsfix.com/?";
    const searchUrl = `https://www.amazon.com.br/s?k=${product_name}`;

    const url = proxyUrl + searchUrl;

    try {
      const html = await axios.get(url, {
        headers: {
          origin: "https://app.corsfix.com",
          "sec-fetch-mode": "cros",
        },
      });

      const $ = cheerio.load(html?.data);
      const products: any = [];

      $('[role="listitem"]').each((index: any, item: any) => {
        // const name = $(item).find(".a-text-normal").text();
        const name = $(item).find("h2 span").text();
        const price = `${$(item).find(".a-price-whole").text()}${$(item)
          .find(".a-price-fraction")
          .text()}`;

        const image = $(item).find(".s-image").attr("src");
        const link =
          "https://www.amazon.com.br/" +
          $(item).find(".a-link-normal.s-no-outline").attr("href");

        if (name && price && image && link) {
          products.push({ name, price, image, link });
        }
      });

      return products;
    } catch (err: any) {
      return [];
    }
  };

  static clearDataBase = async () => {
    const tables = db
      .prepare(
        `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`
      )
      .all();

    tables.forEach(({ name }: any) => {
      if (name !== "stores") {
        db.exec(`DELETE FROM "${name}";`);
      }
    });
  };

  //   static addStores = async () => {
  //     const insertQuery = `INSERT OR IGNORE INTO stores (
  //     name, route, store_id, parent_store_type, store_type, type, banner_url, preferred_order )
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  // `;
  //     const stmt = db.prepare(insertQuery);

  //   };

  // static getAllProductsDay = async () => {
  //   const getAllConfigsStores = db.prepare(`SELECT * FROM stores`).all();

  //   return;

  //   const AllconfigsStores = getAllConfigsStores.map((configStore: any) => {
  //     return {
  //       state: {
  //         parent_store_type: configStore.parent_store_type,
  //         store_type: configStore.store_type,
  //       },
  //       stores: [Number(configStore.store_id)],
  //     };
  //   });

  //   const AllStoreProductOffers = await Promise.all(
  //     AllconfigsStores.map(async (configStore: any) => {
  //       const storeProducts = await StoreService.getAllStoreProductOffers({
  //         configs: configStore,
  //         firstRequestDay: true,
  //       });

  //       return {
  //         store_id: configStore.stores[0],
  //         products_count: storeProducts.products_count,
  //         products: storeProducts.all,
  //       };
  //     })
  //   );

  //   db.transaction(() => {
  //     AllStoreProductOffers.map((storeProductOffers) => {
  //       const insertQuery = `INSERT OR REPLACE INTO firstProductsDay (
  //         store_id, array_products_string)
  //         VALUES (?, ?)`;

  //       const stmt = db.prepare(insertQuery);
  //       stmt.run(
  //         storeProductOffers.store_id,
  //         JSON.stringify(storeProductOffers.products, null, 0)
  //       );
  //     });

  //     const insertLastRunStmt = db.prepare(
  //       "INSERT INTO lastRun DEFAULT VALUES"
  //     );
  //     insertLastRunStmt.run();
  //   })();

  //   return AllStoreProductOffers;
  // };
}
