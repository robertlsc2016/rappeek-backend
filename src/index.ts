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
  "/getAllStoreProductOffers",
  validate(storeSchema),
  async (req: Request, res: Response) => {
    console.log(req.body);

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
