// routes/userRoutes.ts
import { Router, Request, Response, response } from "express";

import { validate } from "../middlewares/validateMiddleware";
import Joi from "joi";
import { storeController } from "../controllers/storeController";
import { storeSchema } from "../schemas/storesSchema";

const router = Router();

const userValidationSchema = Joi.object({
  store_id: Joi.number().strict().required(),
});

router.get("/", (req, res) => {
  res.status(200).json("hello world");
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

router.post("/searchLocations", storeController.searchLocations);

router.post("/getGeolocation", storeController.getGeolocation);

router.post("/getStoresByLocation", storeController.getStoresByLocation);
router.post("/getSimilarOnAmazon", storeController.getSimilarOnAmazon);

router.post(
  "/getAllProductsDayByIdStore",
  storeController.getAllProductsDayByIdStore
);

router.get("/clearDataBase", storeController.clearDataBase);

// router.get("/getAllProductsDay", storeController.registerAllProductsDay);
// router.get("/getStores", storeController.getStores);
// router.get("/addMarkets", storeController.addStores);

export { router };
