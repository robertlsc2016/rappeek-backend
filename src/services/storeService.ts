import { cleanHtmlFromAmazon } from "./../utils/cleanHtmlFromAmazon";
import { IConfigs } from "../interfaces/body_requests/IConfigs";
import { getProductsOffer } from "../apiRappiCall/getProductsOffer";
import { clearRequest } from "../utils/reorderProductsInOffer";
import { getGeolocation } from "../apiRappiCall/getGeolocation";
import { getStoresByLocation } from "../apiRappiCall/getStoresByLocation";
import { filterStores } from "../utils/filterStores";
import { searchLocations } from "../apiRappiCall/searchLocations";
import { getInfoStore } from "../apiRappiCall/getInfoStore";
import { reorderProductsByRange } from "../utils/reorderProductsByRange";
import { filterProductsStoresGlobalSearch } from "../utils/filterProductsStoresGlobalSearch";
import { ClearDatabase } from "../queries/clearDataBase";
import { getGlobalSearchProducts } from "../apiRappiCall/getGlobalSearchProducts";
import { filterLocations } from "../utils/filterLocations";
import { getSimilarOnAmazon } from "../amazonCall/getSimilarOnAmazon";
import { IProductsOfferByRange } from "../interfaces/returns/IProductsOffer";

const cheerio = require("cheerio");

export class StoreService {
  static async getInfoStoreService({ store_id }: { store_id: number }) {
    try {
      const infosStore = await getInfoStore({ store_id: store_id });
      return infosStore;
    } catch (err: any) {
      throw err;
    }
  }

  static async getAllStoreProductOffers({
    configs,
  }: {
    configs: IConfigs;
  }): Promise<IProductsOfferByRange | any> {

    const store_id = configs.store_id;

    try {
      const fetchProductsInOffer = await getProductsOffer({ configs: configs });
      const cleanRequest = await clearRequest(fetchProductsInOffer);

      const productsByRangeSorted = await reorderProductsByRange({
        products: cleanRequest,
        store_id: store_id,
      });

      return productsByRangeSorted;
    } catch (err: any) {
      throw err;
    }
  }

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
    try {
      const fetchLocations = await searchLocations({ query: query });
      const _filterLocations = filterLocations({
        locations: fetchLocations,
      });
      return _filterLocations;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  static getGeolocation = async ({ place_id }: { place_id: string }) => {
    try {
      const _geoLocation = await getGeolocation({ place_id: place_id });
      return _geoLocation;
    } catch (err: any) {
      throw err;
    }
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

  static fetchSimilarOnAmazon = async ({
    product_name,
  }: {
    product_name: string;
  }) => {
    try {
      const htmlAmazon = await getSimilarOnAmazon({
        product_name: product_name,
      });
      const cleanHtml = await cleanHtmlFromAmazon({ html: htmlAmazon });
      return cleanHtml;
    } catch (err: any) {
      throw err;
    }
  };

  static clearDataBase = async () => {
    return ClearDatabase();
  };
}
