import {
  IProductGlobal,
  IStoresProductsGlobalSearch,
} from "./../interfaces/IProduct";
import Axios from "../axios/axiosInstance";

export const getGlobalSearchProducts = async ({
  query,
  lat,
  lng,
}: {
  query: string;
  lat: number;
  lng: number;
}) : Promise<IStoresProductsGlobalSearch[]> => {
  try {
    const base_url = `https://services.rappi.com.br/api/pns-global-search-api/v1/unified-search?is_prime=true&unlimited_shipping=true`;

    const {
      data: { stores: getGlobalProducts },
    } = await Axios.post(base_url, {
      params: { is_prime: true, unlimited_shipping: true },
      tiered_stores: [],
      lat: lat,
      lng: lng,
      query: query,
      options: {},
    });

    return getGlobalProducts;
  } catch (err) {
    throw {
      message: "erro ao fazer a buscar global na api do rappi",
      status: 503,
      error: err,
    };
  }
};
