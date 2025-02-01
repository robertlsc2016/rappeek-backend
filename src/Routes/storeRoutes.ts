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
  "/products_offer",
  validate(storeSchema),
  storeController.getAllStoreProductOffers
);

router.post(
  "/globalSearchProducts",
  validate(
    Joi.object({
      query: Joi.string().strict().required(),
      lat: Joi.number().strict().required(),
      lng: Joi.number().strict().required(),
    })
  ),
  storeController.globalSearchProducts
);

// router.post("/getNewProductsStore", storeController.getNewProductsStoreController);

router.post("/searchLocations", storeController.searchLocationsController);

router.post(
  "/getGeolocation",
  validate(
    Joi.object({
      place_id: Joi.string().strict().required(),
    })
  ),
  storeController.getGeolocation
);

router.post("/getStoresByLocation", storeController.getStoresByLocation);

router.post("/getSimilarOnAmazon", storeController.getSimilarOnAmazon);

router.get("/clearDataBase", storeController.clearDataBase);

export { router };
