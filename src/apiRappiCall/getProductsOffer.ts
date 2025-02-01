import Axios from "../axios/axiosInstance";
import { IConfigs } from "../interfaces/IConfigs";
const _ = require("lodash");

// FAZ A CHAMADA PARA O RAPPI E RETORNA A CHAMADA BRUTA
export const getProductsOffer = async ({ configs }: { configs: IConfigs }) => {
  try {
    const base_url =
      "https://services.rappi.com.br/api/web-gateway/web/dynamic/context/content/";

    const contexts = [
      { context: "sub_aisles", limit: 100 },
      { context: "store_home", limit: 100 },
    ];

    const results = await Promise.all(
      contexts.map(async (context) => {
        return (
          (await Axios.post(
            base_url,
            {
              state: configs.state,
              stores: [configs.stores[0]],
              context: context.context,
              limit: context.limit,
            },
            { timeout: 10000 }
          )) || []
        );
      })
    );

    if (results[0].status == 204) {
      return {
        status: 204,
        message: "está lojá não existe na base de dados da rappi",
      };
    }

    const _result = [
      results[0].data.data.components,
      results[1].data.data.components,
    ];

    return _result;
  } catch (err) {
    throw new Error(`erro ao buscar produtos na api do rappi: ${err}`);
  }
};
