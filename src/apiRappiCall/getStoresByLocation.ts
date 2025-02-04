import Axios from "../axios/axiosInstance";

export const getStoresByLocation = async ({
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
        error: "não existem lojas dispoíveis para sua localidade",
      };
    }

    const stract_stores = data.data.data.context_info.stores;
    return stract_stores;
  } catch (err: any) {
    throw err
  }
};
