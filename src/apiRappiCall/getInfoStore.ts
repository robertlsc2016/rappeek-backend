import Axios from "../axios/axiosInstance";
import { IBodyInfosStoreReturn, IInfosStoreResponse } from "../interfaces/IInfosStore";

export const getInfoStore = async ({
  store_id,
}: {
  store_id: number;
}): Promise<IBodyInfosStoreReturn | any> => {
  try {
    const { data: infosStoreRespose }: { data: IInfosStoreResponse } = await Axios.get(
      `https://services.rappi.com.br/api/web-gateway/web/stores-router/id/${store_id}/`
    ).catch((err) => {
      throw {
        message: "erro ao coletar informacoes da loja com a api do rappi",
        status: 500,
        error: err,
      };
    });

    if (infosStoreRespose['error_backend_stores-router-id']?.http_status_code == 404) {
      throw {
        message: `loja não encontrada na base de dados na api da rappi`,
        status: 400,
        error: `loja não encontrada na base de dados na api da rappi`,
      };
    }

    const filteredStoreInfo: IBodyInfosStoreReturn = {
      address: infosStoreRespose.address,
      name: infosStoreRespose.name,
      store_id: infosStoreRespose.store_id,

      parent_store_type: infosStoreRespose.store_type.store_type_group.group,
      store_type: infosStoreRespose.store_type.store_type_group.store_type
    };

    return filteredStoreInfo;
  } catch (err: any) {
    throw err;
  }
};
