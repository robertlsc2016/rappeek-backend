import { IConfigs } from "../interfaces/body_requests/IConfigs";
import { StoreService } from "../services/storeService";
import db from "../createDatabase";

export const filterNewProducts = async ({ configs }: { configs: IConfigs }) => {
  const storeId = configs.store_id;

  const newProductsFromDb = await getNewProducts(storeId);

  const liveProductsStore = await StoreService.getAllStoreProductOffers({
    configs,
  });

  const oldProducts = await getOldProducts(storeId);

  if (oldProducts.length === 0) {
    await updateNewProducts(storeId, []);
    return createResponse(storeId, []);
  }

  const uniqueProducts = liveProductsStore.all.filter(
    (product: any) =>
      !oldProducts.some((oldProduct: any) =>
        isProductEqual(oldProduct, product)
      )
  );

  const combinedProducts = uniqueProducts.filter(
    (product: any) =>
      !newProductsFromDb.some((newProduct: any) =>
        isProductEqual(newProduct, product)
      )
  );

  await updateNewProducts(storeId, combinedProducts);

  if (combinedProducts.length === 0) {
    await updateNewProducts(storeId, []);
    return createResponse(storeId, []);
  }

  return createResponse(
    storeId,
    combinedProducts,
    newProductsFromDb.created_at
  );
};

const isProductEqual = (product1: any, product2: any): boolean => {
  return product1.id === product2.id && product1.price === product2.price;
};


const getOldProducts = (storeId: number) => {
  const stmt = db.prepare(`SELECT * FROM storeProducts WHERE store_id = ?`);
  const result: any = stmt.get(storeId);
  return result?.array_products_string
    ? JSON.parse(result.array_products_string)
    : [];
};


const getNewProducts = (storeId: number) => {
  const stmt = db.prepare("SELECT * FROM newProductsStore WHERE store_id = ?");
  const result: any = stmt.get(storeId);
  return result;
};


const updateNewProducts = async (storeId: number, products: any[]) => {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO newProductsStore (store_id, array_products_string) VALUES (?, ?)"
  );
  return stmt.run(storeId, JSON.stringify(products, null, 0));
};

const createResponse = (storeId: number, products: any[], createdAt?: Date) => {
  return {
    store_id: storeId,
    created_at: createdAt || new Date(),
    products,
  };
};
