import { Request, Response } from "express";
import Axios from "../axios/axiosInstance";
import db from "../createDatabase";
import { filterProducts } from "../utils/filterProducts";

import { filterNewProducts } from "../utils/filterNewProducts";
import { IStoreProductOffer } from "../interfaces/IStoreProductOffer";
import { IConfigs } from "../interfaces/IConfigs";
import axios from "axios";
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

    const contexts = [
      { context: "sub_aisles", limit: 100 },
      { context: "store_home", limit: 100 },
      { context: "sub_aisles", limit: 100 },
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

    const [list1, list2, list3] = results;

    const filteredProductsList1 = await filterProducts(list1.data.data, 0);
    const filteredProductsList2 = await filterProducts(list2.data.data, 3);
    const filteredProductsList3 = await filterProducts(list3.data.data, 3);

    const allProducts = [
      ...filteredProductsList1,
      ...filteredProductsList2,
      ...filteredProductsList3,
    ];

    const uniqueProducts = _.uniqBy(allProducts, "id").filter(
      (product: any) => product.discount > 0
    );

    const allProductsClean: any = {
      store_id: configs.stores[0],
      created_at: new Date(),
      products_count: uniqueProducts.length,
      products: uniqueProducts,
    };

    if (!onlyRead) {
      const insert = db.prepare(
        "INSERT OR REPLACE INTO storeProducts (store_id, array_products_string) VALUES (?, ?)"
      );

      insert.run(configs.stores[0], JSON.stringify(uniqueProducts, null, 0));
    }

    const discountRanges = [80, 60, 40, 10, 0];

    const rangeProducts = discountRanges.reduce(
      (acc: any, range, index) => {
        const nextRange = discountRanges[index - 1] || Infinity;
        acc[range] = allProductsClean.products
          .filter(
            (product: any) =>
              product.discount < nextRange / 100 &&
              product.discount >= range / 100 &&
              product.discount > 0
          )
          .sort((a: any, b: any) => b.discount - a.discount); // Ordena do maior para o menor desconto

        return acc;
      },
      {
        store_id: configs.stores[0],
        products_count: uniqueProducts.length,
        all: allProductsClean.products
          .filter((product: any) => product.discount > 0)
          .sort((a: any, b: any) => b.discount - a.discount),
      }
    );

    return rangeProducts;
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

  static async globalSearchProducts({ query }: { query: string }) {
    const priorityOrder = [
      900604367, 900542505, 900156624, 900536162, 900020818, 900631973,
    ];

    const base_url = `https://services.rappi.com.br/api/pns-global-search-api/v1/unified-search?is_prime=true&unlimited_shipping=true`;

    const getGlobalProducts = await Axios.post(base_url, {
      params: { is_prime: true, unlimited_shipping: true },
      tiered_stores: [],
      lat: -23.5717729,
      lng: -46.730492,
      query: query,
      options: {},
    });

    getGlobalProducts.data.stores.sort((a: any, b: any) => {
      const priorityA = priorityOrder.indexOf(a.store_id);
      const priorityB = priorityOrder.indexOf(b.store_id);

      return (
        (priorityA === -1 ? Infinity : priorityA) -
        (priorityB === -1 ? Infinity : priorityB)
      );
    });

    return getGlobalProducts.data.stores;
  }

  // static async getStores() {
  //   const stmt = db.prepare(`
  //   SELECT * FROM stores
  //   ORDER BY
  //     preferred_order IS NOT NULL DESC,
  //     preferred_order ASC
  // `);
  //   const stores = stmt.all();

  //   return stores;
  // }

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
      const {
        data: {
          data: {
            context_info: { stores: stores },
          },
        },
      } = await Axios.post(
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

      const filteredStores = stores.map(
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
    const searchUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(
      product_name
    )}`;

    const url = proxyUrl + searchUrl;

    const html = await Axios.get(url, {
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
