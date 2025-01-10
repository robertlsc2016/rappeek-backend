import { IConfigs } from "../interfaces/IConfigs";
import { StoreService } from "../services/storeService";
import db from "../createDatabase";

export const filterNewProducts = async ({ configs }: { configs: IConfigs }) => {
  // Obter produtos ao vivo
  const liveProductsStore = await StoreService.getAllStoreProductOffers({
    configs,
    firstRequestDay: false,
  });

  const storeId = configs.stores[0];
  const oldProducts = getOldProducts(storeId);

  // Se não houver produtos antigos, retorne os produtos ao vivo
  if (oldProducts.length === 0) return liveProductsStore;

  const newProductsFromDb = getNewProducts(storeId);

  // Filtrar produtos únicos
  const uniqueInArray = liveProductsStore.products.filter(
    (product: any) =>
      !oldProducts.some((oldProduct: any) => isObjectEqual(oldProduct, product))
  );

  const combinedProducts = [
    ...newProductsFromDb,
    ...uniqueInArray.filter(
      (product: any) =>
        !newProductsFromDb.some((newProduct: any) =>
          isObjectEqual(newProduct, product)
        )
    ),
  ];

  // Atualizar produtos no banco
  updateNewProducts(storeId, combinedProducts);

  return {
    id_store: storeId,
    created_at: newProductsFromDb.created_at,
    products: combinedProducts,
  };
};
const isObjectEqual = (obj1: any, obj2: any): boolean => {
  return obj1.id === obj2.id && obj1.price === obj2.price;
};

// Função para obter produtos antigos do banco
const getOldProducts = (storeId: number) => {
  const stmt = db.prepare(`SELECT * FROM firstProductsDay WHERE id_store = ?`);
  const result: any = stmt.get(storeId);
  return result?.array_products_string
    ? JSON.parse(result.array_products_string)
    : [];
};

const getNewProducts = (storeId: number) => {
  const stmt = db.prepare("SELECT * FROM newProductsStore WHERE id_store = ?");
  const result: any = stmt.get(storeId);
  return result?.array_products_string
    ? JSON.parse(result.array_products_string)
    : [];
};

const updateNewProducts = (storeId: number, products: any[]) => {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO newProductsStore (id_store, array_products_string) VALUES (?, ?)"
  );
  stmt.run(storeId, JSON.stringify(products, null, 0));
};
