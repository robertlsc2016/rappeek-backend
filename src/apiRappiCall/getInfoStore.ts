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
    const { data } = await Axios.get<StoreInfos | any>(
      `https://services.rappi.com.br/api/web-gateway/web/stores-router/id/${store_id}/`
    );
    
    if (data["error_backend_stores-router-id"].http_status_code == 404) {
      throw new Error(
        `[message: erro ao se comunicar com a api de rappi para busca de informações da loja] [error: loja não encontrada. revise o store_id]`
      );
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
    throw new Error(
      `${err.message}`
    );
  }
};
