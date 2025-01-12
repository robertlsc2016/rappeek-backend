import { Request, Response } from "express";
import Axios from "../axios/axiosInstance";
import db from "../createDatabase";
import { filterProducts } from "../utils/filterProducts";
import storesMock from "../database/mock_data_markets";
import { filterNewProducts } from "../utils/filterNewProducts";
import { IStoreProductOffer } from "../interfaces/IStoreProductOffer";
import { IConfigs } from "../interfaces/IConfigs";
const _ = require("lodash");

export class StoreService {
  static async getInfoStoreService({ id_store }: { id_store: number }) {
    const { data } = await Axios.get(
      `https://services.rappi.com.br/api/web-gateway/web/stores-router/id/${id_store}/`
    );

    return data;
  }

  static async getAllStoreProductOffers({
    configs,
    firstRequestDay = false,
  }: {
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
          (await Axios.post(base_url, {
            state: configs.state,
            stores: [configs.stores[0]],
            context: context.context,
            limit: context.limit,
          })) || []
        );
      })
    );

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

    if (uniqueProducts.length === 0) {
      const _getProductsInDB = db.prepare(
        "SELECT * FROM firstProductsDay WHERE id_store = ?"
      );
      const getProductsInDB: any = _getProductsInDB.get(configs.stores[0]);

      const allProductsClean: any = {
        id_store: getProductsInDB.id_store,
        products_count: JSON.parse(getProductsInDB?.array_products_string)
          .length,
        products: JSON.parse(getProductsInDB?.array_products_string),
      };

      return allProductsClean;
    }

    const allProductsClean: any = {
      id_store: configs.stores[0],
      created_at: new Date(),
      products_count: uniqueProducts.length,
      products: uniqueProducts,
    };

    const insert = db.prepare(
      "INSERT OR REPLACE INTO storeProducts (id_store, array_products_string) VALUES (?, ?)"
    );

    insert.run(configs.stores[0], JSON.stringify(uniqueProducts, null, 0));

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
        id_store: configs.stores[0],
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

  static getAllProductsDay = async () => {
    const getAllConfigsStores = db.prepare(`SELECT * FROM stores`).all();

    const AllconfigsStores = getAllConfigsStores.map((configStore: any) => {
      return {
        state: {
          parent_store_type: configStore.parent_store_type,
          store_type: configStore.store_type,
        },
        stores: [Number(configStore.id_store)],
      };
    });

    const AllStoreProductOffers = await Promise.all(
      AllconfigsStores.map(async (configStore: any) => {
        const storeProducts = await StoreService.getAllStoreProductOffers({
          configs: configStore,
          firstRequestDay: true,
        });

        return {
          id_store: configStore.stores[0],
          products_count: storeProducts.products_count,
          products: storeProducts.all,
        };
      })
    );

    db.transaction(() => {
      AllStoreProductOffers.map((storeProductOffers) => {
        const insertQuery = `INSERT OR REPLACE INTO firstProductsDay (
          id_store, array_products_string) 
          VALUES (?, ?)`;

        const stmt = db.prepare(insertQuery);
        stmt.run(
          storeProductOffers.id_store,
          JSON.stringify(storeProductOffers.products, null, 0)
        );
      });

      const insertLastRunStmt = db.prepare(
        "INSERT INTO lastRun DEFAULT VALUES"
      );
      insertLastRunStmt.run();
    })();

    return AllStoreProductOffers;
  };

  static getAllProductsDayByIdStore = async ({
    id_store,
  }: {
    id_store: number;
  }): Promise<IStoreProductOffer | { error: string } | []> => {
    if (!id_store) {
      return { error: "O parâmetro id_store é obrigatório." };
    }

    const stmt = db.prepare(`SELECT * FROM storeProducts WHERE id_store = ?`);
    const products = stmt.get(id_store);

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

  static async getStores() {
    const stmt = db.prepare(`
    SELECT * FROM stores
    ORDER BY 
      preferred_order IS NOT NULL DESC, 
      preferred_order ASC                
  `);

    const stores = stmt.all();
    return stores;
  }

  static addStores = async () => {
    const insertQuery = `INSERT OR IGNORE INTO stores (
    name, route, id_store, parent_store_type, store_type, type, banner_url, preferred_order ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
    const stmt = db.prepare(insertQuery);

    storesMock.forEach((store) => {
      stmt.run(
        store.name,
        store.route,
        store.id_store,
        store.parent_store_type,
        store.store_type,
        store.type,
        store.banner_url,
        store.preferred_order
      );
    });

    return storesMock;
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
}
