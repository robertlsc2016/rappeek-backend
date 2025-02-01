import { console } from "inspector/promises";
import Axios from "../axios/axiosInstance";

interface StoreInfos {
  address: string;
  name: string;
  store_id: string;
  store_type_id: string;
  store_type: any;
}

interface StoreType {
  parent_id: string;
}

export const getInfoStore = async ({
  store_id,
}: {
  store_id: number;
}): Promise<StoreInfos | any> => {
  try {
    const { data } = await Axios.get(
      `https://services.rappi.com.br/api/web-gateway/web/stores-router/id/${store_id}/`
    ).catch((err) => {
      throw {
        message: "erro ao coletar informacoes da loja com a api do rappi",
        status: 502,
        error: err,
      };
    });

    if (data["error_backend_stores-router-id"]?.http_status_code == 404) {
      throw {
        message: `loja não encontrada na base de dados na api da rappi`,
        status: 404,
        error: "",
      };
    }

    const filteredStoreInfo: StoreInfos = {
      address: data.address,
      name: data.name,
      store_id: data.store_id,
      store_type_id: data.store_type_id,
      store_type: data.store_type.parent_id,
    };

    return filteredStoreInfo;
  } catch (err: any) {
    throw err;
  }
};
