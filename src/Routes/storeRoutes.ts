import { validate } from "./../middlewares/validateMiddleware";
// routes/userRoutes.ts
import { Router, Request, Response, response } from "express";

import Joi from "joi";
import { storeController } from "../controllers/storeController";
import { bodyProductsOfferSchema, globalSearchProductsSchema, searchLocationsSchema, similarOnAmazonSchema, storeIdSchema } from "../schemas/storesSchema";

const router = Router();



router.get("/", (req, res) => {
  res.status(200).json("hello world");
});

router.post(
  "/getInfoStore",
  validate(storeIdSchema),
  storeController.getInfoStore
);

router.post(
  "/products_offer",
  validate(bodyProductsOfferSchema),
  storeController.getAllStoreProductOffers
);

router.post(
  "/globalSearchProducts",
  validate(globalSearchProductsSchema),
  storeController.globalSearchProducts
);


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

router.post("/getStoresByLocation", validate(
  searchLocationsSchema
), storeController.getStoresByLocation);

router.post(
  "/getSimilarOnAmazon",
  validate(similarOnAmazonSchema),
  storeController.getSimilarOnAmazon
);

router.get("/clearDataBase", storeController.clearDataBase);

export { router };
