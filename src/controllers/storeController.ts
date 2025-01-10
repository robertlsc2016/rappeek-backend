// controllers/userController.ts
import { Request, Response } from "express";
import { StoreService } from "../services/storeService";

export class storeController {
  static async getInfoStore(req: Request, res: Response) {
    try {
      const { id_store } = req.body;
      const store = await StoreService.getInfoStoreService({ id_store });
      res.status(200).json(store);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getNewProductsStore(req: Request, res: Response) {
    const configs = req.body;

    try {
      const products = await StoreService.getNewProductsStore({
        configs: configs,
      });
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async registerAllProductsDay(req?: any, res?: any) {
    try {
      const products = await StoreService.getAllProductsDay();
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getAllProductsDayByIdStore(req: Request, res: Response) {
    const { id_store } = req.body;

    try {
      const products = await StoreService.getAllProductsDayByIdStore({
        id_store: id_store,
      });
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getAllStoreProductOffers(req: Request, res: Response) {
    const configs = req.body;

    try {
      const products = await StoreService.getAllStoreProductOffers({
        configs: configs,
        firstRequestDay: false,
      });
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async globalSearchProducts(req: Request, res: Response) {
    const { query } = req.body;

    try {
      const products = await StoreService.globalSearchProducts({
        query: query,
      });
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getStores(req: Request, res: Response) {
    try {
      const stores = await StoreService.getStores();
      res.status(200).json(stores);
    } catch (err: any) {
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

  static async addStores(req: Request, res: Response) {
    try {
      const markets = await StoreService.addStores();
      res
        .status(200)
        .json({ message: "Markets added successfully", data: markets });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
