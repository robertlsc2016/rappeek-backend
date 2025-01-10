// routes/userRoutes.ts
import { Router, Request, Response, response } from "express";

import { validate } from "../middlewares/validateMiddleware";
import Joi from "joi";
import { storeController } from "../controllers/storeController";
import { storeSchema } from "../schemas/storesSchema";

const router = Router();

const userValidationSchema = Joi.object({
  id_store: Joi.number().strict().required(),
});

router.get("/", (req, res) => {
  res.status(200).json("hello world")
});

router.post(
  "/getInfoStore",
  validate(userValidationSchema),
  storeController.getInfoStore
);

router.post(
  "/getAllStoreProductOffers",
  validate(storeSchema),
  storeController.getAllStoreProductOffers
);

router.post(
  "/globalSearchProducts",
  validate(
    Joi.object({
      query: Joi.string().strict().required(),
    })
  ),
  storeController.globalSearchProducts
);

router.post("/getNewProductsStore", storeController.getNewProductsStore);

router.get("/getAllProductsDay", storeController.registerAllProductsDay);

router.post(
  "/getAllProductsDayByIdStore",
  storeController.getAllProductsDayByIdStore
);

router.get("/getStores", storeController.getStores);

router.get("/addMarkets", storeController.addStores);

router.get("/clearDataBase", storeController.clearDataBase);


export { router };
