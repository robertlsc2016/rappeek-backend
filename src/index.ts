import { Query } from "./../node_modules/@types/express-serve-static-core/index.d";
import express, { Request, Response, NextFunction } from "express";
import { ICongigs } from "./interfaces/IConfigs";
import Joi from "joi";
import { storeSchema } from "./schemas/storesSchema";
import Axios from "./axios/axiosInstance";
import { IProduct } from "./interfaces/IProduct";
const _ = require("lodash");
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Middleware de validação
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      // Se houver erro de validação, envia a resposta diretamente e não retorna mais nada
      res.status(400).json({ error: error.details[0].message });
      return; // Apenas retorna a resposta e não o valor `Response`
    }
    next(); // Passa para o próximo middleware ou rota
  };
};

app.post(
  "/getInfoStore",
  validate(
    Joi.object({
      id_store: Joi.number().strict().required(),
    })
  ),
  async (req: Request, res: Response) => {
    const { id_store } = req.body;

    const { data } = await Axios.get(
      `https://services.rappi.com.br/api/web-gateway/web/stores-router/id/${id_store}/`
    );

    res.json(data);
  }
);

app.post(
  "/getAllStoreProductOffers",
  validate(storeSchema),
  async (req: Request, res: Response) => {
    const base_url =
      "https://services.rappi.com.br/api/web-gateway/web/dynamic/context/content/";

    const contexts = [
      { context: "sub_aisles", limit: 100 },
      { context: "store_home", limit: 100 },
      { context: "sub_aisles", limit: 6 },
    ];

    const results = await Promise.all(
      contexts.map((context) =>
        Axios.post(base_url, {
          ...req.body,
          context: context.context,
          limit: context.limit,
        })
      )
    );

    const [list1, list2, list3] = results;

    const filteredProductsList1 = await filterProducts(list1.data.data, 0);
    const filteredProductsList2 = await filterProducts(list2.data.data, 3);
    const filteredProductsList3 = await filterProducts(list3.data.data, 3);

    const allProducts = [
      ...filteredProductsList1,
      ...filteredProductsList2,
      ...filteredProductsList3,
    ];

    const allProductsClean = _.uniqBy(allProducts, "id");
    res.json({ allProductsClean });
  }
);

app.post(
  "/globalSearchProducts",
  validate(
    Joi.object({
      query: Joi.string().strict().required(),
    })
  ),
  async (req: Request, res: Response) => {
    const { query } = req.body;

    const priorityOrder = [
      900604367, 900542505, 900156624, 900536162, 900020818, 900631973,
    ];

    const base_url = `https://services.rappi.com.br/api/pns-global-search-api/v1/unified-search?is_prime=true&unlimited_shipping=true`;

    const getGlobalProducts = await Axios.post(base_url, {
      params: { is_prime: true, unlimited_shipping: true },
      tiered_stores: [],
      lat: -23.5717729,
      lng: -46.730492,
      query: query,
      options: {},
    });

    getGlobalProducts.data.stores.sort((a: any, b: any) => {
      const priorityA = priorityOrder.indexOf(a.store_id);
      const priorityB = priorityOrder.indexOf(b.store_id);

      return (
        (priorityA === -1 ? Infinity : priorityA) -
        (priorityB === -1 ? Infinity : priorityB)
      );
    });


    res.json(getGlobalProducts.data.stores);

    // return getGlobalProducts.data.stores;
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const filterProducts = (data: any, initial_index: number) => {
  console.log(data);

  return data.components
    .filter((component: any) => component.index >= initial_index)
    .flatMap((component: any) =>
      component.resource.products.map(
        ({
          id,
          name,
          price,
          discount,
          real_price,
          image_url,
          quantity,
          unit_type,
        }: IProduct) => ({
          id,
          name,
          price,
          discount,
          real_price,
          image_url,
          quantity,
          unit_type,
        })
      )
    );
};
