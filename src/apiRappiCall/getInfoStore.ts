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
}): Promise<StoreInfos> => {
  try {
    const { data: infoStore } = await Axios.get<StoreInfos>(
      `https://services.rappi.com.br/api/web-gateway/web/stores-router/id/${store_id}/`
    );

    // Extraindo somente os campos necessários
    const filteredStoreInfo: StoreInfos = {
      address: infoStore.address,
      name: infoStore.name,
      store_id: infoStore.store_id,
      store_type_id: infoStore.store_type_id,
      store_type: infoStore.store_type.parent_id,
    };

    return filteredStoreInfo;
  } catch (err) {
    throw new Error(`erro ao encontrar informações da loja: ${err}`);
  }
};
