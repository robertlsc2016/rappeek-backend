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
        return await Axios.post(
          base_url,
          {
            state: configs.state,
            stores: [configs.stores[0]],
            context: context.context,
            limit: context.limit,
          },
          { timeout: 10000 }
        ).catch((err) => {
          console.log(err);
          throw {
            message: "erro ao coletar os produtos em oferta na api do rappi",
            status: 404,
            err: err,
          };
        });
      })
    );

    if (results[0].status == 204 && results[1].status == 204) {
      throw {
        message: "loja não encontrada na base de dados da rappi",
        status: 204,
      };
    }

    const _result = [
      results[0].data.data.components,
      results[1].data.data.components,
    ];

    return _result;
  } catch (err) {
    throw err;
  }
};
