import { IStoreProductOffer } from "../interfaces/IStoreProductOffer";
import { IConfigs } from "../interfaces/IConfigs";
import axios from "axios";
import { getProductsOffer } from "../apiRappiCall/getProductsOffer";
import { productsByRange } from "../queries/productsByRange";
import { clearRequest } from "../utils/reorderProductsInOffer";
import { getGeolocation } from "../apiRappiCall/getGeolocation";
import { getStoresByLocation } from "../apiRappiCall/getStoresByLocation";
import { filterStores } from "../utils/filterStores";
import { searchLocations } from "../apiRappiCall/searchLocations";
import { getInfoStore } from "../apiRappiCall/getInfoStore";
import { deleteAllProductsByID } from "../queries/deleteAllProductsByID";
import { insertProducts } from "../queries/insertProducts";
import { reorderProductsByRange } from "../utils/reorderProductsByRange";
import { filterProductsStoresGlobalSearch } from "../utils/filterProductsStoresGlobalSearch";
import { ClearDatabase } from "../queries/clearDataBase";
import { getGlobalSearchProducts } from "../apiRappiCall/getGlobalSearchProducts";
import { filterLocations } from "../utils/filterLocations";
import { getProductsByStoreId } from '../queries/getProductsByStoreId';
const diff = require('diff-arrays-of-objects');
const cheerio = require("cheerio");

export class StoreService {
  static async getInfoStoreService({ store_id }: { store_id: number }) {
    const infosStore = await getInfoStore({ store_id: store_id });
    return infosStore;
  }

  static async getAllStoreProductOffers({
    configs,
  }: {
    onlyRead: boolean;
    configs: IConfigs;
    firstRequestDay: boolean;
  }): Promise<IStoreProductOffer | any> {
    const store_id = configs.stores[0];

    // COLETA PRODUTOS
    const fetchProductsInOffer = await getProductsOffer({ configs: configs });
    // LIMPA A REQUISICAO
    const cleanRequest = await clearRequest(fetchProductsInOffer);

    // DELETA O QUE TEM PELO STORE_ID
    await deleteAllProductsByID({ store_id: store_id });
    // BOTA OS PRODUTOS NOVOS
    await insertProducts({
      configs: configs,
      products: cleanRequest,
    });

    const products = await productsByRange({ configs: configs });
    const productsByRangeSorted = await reorderProductsByRange({
      products: products,
      store_id: store_id,
    });
    return productsByRangeSorted;
  }

  // static async getNewProductsStoreService({ configs }: { configs: IConfigs }) {
  //   const productsInDB = getProductsByStoreId({store_id: configs.stores[0]})
  //   const productsFromAPI = await getProductsOffer({ configs: configs });
  //   const cleanRequest = await clearRequest(productsFromAPI);

  //   const diffArrays = diff(productsInDB, cleanRequest, "id");
  //   return diffArrays.added
  // }

  static async globalSearchProducts({
    query,
    lat,
    lng,
  }: {
    query: string;
    lat: any;
    lng: any;
  }) {
    const globalSearch = await getGlobalSearchProducts({
      lat: lat,
      lng: lng,
      query: query,
    });

    const filterGlobalSearch = await filterProductsStoresGlobalSearch({
      globalStoresProducts: globalSearch,
    });

    return filterGlobalSearch;
  }

  static searchLocationsService = async ({ query }: { query: string }) => {
    const fetchLocations = await searchLocations({ query: query });

    const _filterLocations = await filterLocations({
      locations: fetchLocations,
    });
    return _filterLocations;
  };

  static getGeolocation = async ({ place_id }: { place_id: string }) => {
    const _geoLocation = await getGeolocation({ place_id: place_id });
    return _geoLocation;
  };

  static getStoresByLocation = async ({
    lat,
    lng,
  }: {
    lat: string;
    lng: string;
  }) => {
    const fetchStoresByLocation = await getStoresByLocation({
      lat: lat,
      lng: lng,
    });

    const _filterStores = await filterStores({
      stores: fetchStoresByLocation,
    });

    return _filterStores;
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
    return ClearDatabase();
  };
}
