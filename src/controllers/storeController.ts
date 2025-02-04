// controllers/userController.ts
import { Request, Response } from "express";
import { StoreService } from "../services/storeService";
import { logger } from "../logger";
export class storeController {
  static async getInfoStore(req: Request, res: Response) {
    try {
      const { store_id } = req.body;
      const store = await StoreService.getInfoStoreService({ store_id });
      res.status(200).json(store);
    } catch (err: any) {
      logger.log("error", err)
      res.status(err.status).json(err);
    }
  }

  static async getAllStoreProductOffers(
    req: Request,
    res: Response
  ): Promise<void | any> {
    const { parent_store_type, store_type, store_id } = req.body;
    let configs = {
      parent_store_type: parent_store_type,
      store_type: store_type,
      store_id: store_id
    }

    try {
      const products = await StoreService.getAllStoreProductOffers({
        configs: configs,
      });

      if (products.status === 204) {
        const response = {
          status: 204,
          message: "está lojá não existe na base de dados da rappi",
        };

        return res.status(404).json(response);
      }

      return res.status(200).json(products);
    } catch (err: any) {
      logger.log("error", err)
      res.status(err.status).json(err);
    }
  }

  static async globalSearchProducts(req: Request, res: Response) {
    const { query, lat, lng } = req.body;
    try {
      const products = await StoreService.globalSearchProducts({
        query: query,
        lat: lat,
        lng: lng,
      });
      res.status(200).json(products);
    } catch (err: any) {
      logger.log("error", err)
      res.status(500).json({ message: err.message });
    }
  }

  static async clearDataBase(req: Request, res: Response) {
    try {
      const status = await StoreService.clearDataBase();
      res.status(200).json("success");
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async searchLocationsController(req: Request, res: Response) {
    const { query } = req.body;
    try {
      const locations = await StoreService.searchLocationsService({
        query: query,
      });
      res.status(200).json(locations);
    } catch (err: any) {
      logger.log("error", err)
      res.status(500).json({ message: err.message });
    }
  }

  static async getGeolocation(req: Request, res: Response) {
    const { place_id } = req.body;

    try {
      const geolocation = await StoreService.getGeolocation({
        place_id: place_id,
      });
      res.status(200).json(geolocation);
    } catch (err: any) {
      logger.log("error", err)
      res.status(err.status).json(err);
    }
  }

  static async getStoresByLocation(req: Request, res: Response) {
    const { lat, lng } = req.body;
    try {
      const store_by_location = await StoreService.getStoresByLocation({
        lat: lat,
        lng: lng,
      });
      res.status(200).json(store_by_location);
    } catch (err: any) {
      logger.log("error", err)
      res.status(500).json({ message: err.message });
    }
  }

  static async getSimilarOnAmazon(req: Request, res: any) {
    const { product_name } = req.body;

    try {
      const products_amazon = await StoreService.fetchSimilarOnAmazon({
        product_name: product_name,
      });
      return res.status(200).json(products_amazon);
    } catch (err: any) {
      logger.log("error", err)
      res.status(err.status).json(err);
    }
  }
}
