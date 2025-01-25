import { response } from "express";
// controllers/userController.ts
import { Request, Response } from "express";
import { StoreService } from "../services/storeService";

export class storeController {
  static async getInfoStore(req: Request, res: Response) {
    try {
      const { store_id } = req.body;
      const store = await StoreService.getInfoStoreService({ store_id });
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

  // static async registerAllProductsDay(req?: any, res?: any) {
  //   try {
  //     const allProducts = await StoreService.getAllProductsDay();
  //     res.status(200).json({ success: true });
  //   } catch (err: any) {
  //     res.status(500).json({ message: err.message });
  //   }
  // }

  static async getAllProductsDayByIdStore(req: Request, res: Response) {
    const { store_id } = req.body;

    try {
      const products = await StoreService.getAllProductsDayByIdStore({
        store_id: store_id,
      });
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getAllStoreProductOffers(
    req: Request,
    res: Response
  ): Promise<void | any> {
    const configs = req.body;

    try {
      const products = await StoreService.getAllStoreProductOffers({
        configs: configs,
        onlyRead: false,
        firstRequestDay: false,
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

  // static async getStores(req: Request, res: Response) {
  //   try {
  //     const stores = await StoreService.getStores();
  //     res.status(200).json(stores);
  //   } catch (err: any) {
  //     res.status(500).json({ message: err.message });
  //   }
  // }

  static async clearDataBase(req: Request, res: Response) {
    try {
      const status = await StoreService.clearDataBase();
      res.status(200).json("success");
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async searchLocations(req: Request, res: Response) {
    const { query } = req.body;

    try {
      const locations = await StoreService.searchLocations({ query: query });
      res.status(200).json(locations);
    } catch (err: any) {
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
      res.status(500).json({ message: err.message });
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
      res.status(500).json({ message: err.message });
    }
  }
  static async getSimilarOnAmazon(req: Request, res: Response) {
    const { product_name } = req.body;
    try {
      const products_amazon = await StoreService.getSimilarOnAmazon({
        product_name: product_name,
      });
      res.status(200).json(products_amazon);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  // static async addStores(req: Request, res: Response) {
  //   try {
  //     const markets = await StoreService.addStores();
  //     res
  //       .status(200)
  //       .json({ message: "Markets added successfully", data: markets });
  //   } catch (err: any) {
  //     res.status(500).json({ message: err.message });
  //   }
  // }
}
