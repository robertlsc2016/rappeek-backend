import Axios from "../axios/axiosInstance";

export const getGlobalSearchProducts = async ({
  query,
  lat,
  lng,
}: {
  query: string;
  lat: any;
  lng: any;
}) => {
  const base_url = `https://services.rappi.com.br/api/pns-global-search-api/v1/unified-search?is_prime=true&unlimited_shipping=true`;

  const getGlobalProducts: any = await Axios.post(base_url, {
    params: { is_prime: true, unlimited_shipping: true },
    tiered_stores: [],
    lat: lat,
    lng: lng,
    query: query,
    options: {},
  });

  return getGlobalProducts.data.stores;
};
