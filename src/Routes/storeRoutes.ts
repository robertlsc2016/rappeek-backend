// routes/userRoutes.ts
import { Router } from "express";
import { validate } from "./../middlewares/validateMiddleware";

import Joi from "joi";
import { StoreController } from "../controllers/storeController";
import { bodyProductsOfferSchema, globalSearchProductsSchema, searchLocationsSchema, similarOnAmazonSchema, storeIdSchema } from "../schemas/storesSchema";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json("hello world");
});

router.post(
  "/getInfoStore",
  validate(storeIdSchema),
  StoreController.getInfoStore
);

router.post(
  "/products_offer",
  validate(bodyProductsOfferSchema),
  StoreController.getAllStoreProductOffers
);

router.post(
  "/globalSearchProducts",
  validate(globalSearchProductsSchema),
  StoreController.globalSearchProducts
);


router.post("/searchLocations", StoreController.searchLocationsController);

router.post(
  "/getGeolocation",
  validate(
    Joi.object({
      place_id: Joi.string().strict().required(),
    })
  ),
  StoreController.getGeolocation
);

router.post("/getStoresByLocation", validate(
  searchLocationsSchema
), StoreController.getStoresByLocation);

router.post(
  "/getSimilarOnAmazon",
  validate(similarOnAmazonSchema),
  StoreController.getSimilarOnAmazon
);

router.get("/clearDataBase", StoreController.clearDataBase);

export { router };
