import { IConfigs } from "../interfaces/IConfigs";
import { StoreService } from "../services/storeService";
import db from "../createDatabase";

export const filterNewProducts = async ({ configs }: { configs: IConfigs }) => {
  const liveProductsStore: any = await StoreService.getAllStoreProductOffers({
    configs: configs,
    firstRequestDay: false,
  });

  liveProductsStore.products.push({
    id: "meu teste 2",
    name: "12 x Coca-Cola Refrigerante Sem Açúcar 200 mL",
    price: 21.48,
    discount: 0,
    real_price: 21.48,
    image_url:
      "https://images.rappi.com.br/products/50a893e0-827c-4698-896b-bc9ec888b4e6.png",
    quantity: 200,
    unit_type: "ml",
  });

  const _oldProducts: any = db.prepare(
    `SELECT * FROM firstProductsDay WHERE id_store = ?`
  );
  const oldProducts: any = _oldProducts.get(configs.stores[0]);

  const oldProductsClear = oldProducts?.array_products_string
    ? JSON.parse(oldProducts.array_products_string)
    : [];

  if (oldProductsClear.length === 0) return liveProductsStore;

  const stmt = db.prepare("SELECT * FROM newProductsStore WHERE id_store = ?");
  const data_newProducts: any = stmt.get(configs.stores[0]) || [];

  const isObjectEqual = (obj1: any, obj2: any) => {
    return obj1.id === obj2.id && obj1.price === obj2.price;
  };

  const uniqueInArray = liveProductsStore.products.filter(
    (obj2: any) =>
      !oldProductsClear.some((obj1: any) => isObjectEqual(obj1, obj2))
  );

  if (
    data_newProducts.length === 0 ||
    JSON.parse(data_newProducts.array_products_string).length == 0
  ) {
    const insert = db.prepare(
      "INSERT OR REPLACE INTO newProductsStore (id_store, array_products_string) VALUES (?, ?)"
    );

    insert.run(configs.stores[0], JSON.stringify(uniqueInArray, null, 0));
  }

  const newUniqueInArray = uniqueInArray.filter(
    (obj2: any) =>
      !JSON.parse(data_newProducts.array_products_string).some((obj1: any) =>
        isObjectEqual(obj1, obj2)
      )
  );

  const combinedArrays = [
    ...JSON.parse(data_newProducts.array_products_string),
    ...newUniqueInArray,
  ];

  const insertNewProducts = db.prepare(
    "INSERT OR REPLACE INTO newProductsStore (id_store, array_products_string) VALUES (?, ?)"
  );

  console.log(JSON.stringify(combinedArrays, null, 0));

  insertNewProducts.run(
    configs.stores[0],
    JSON.stringify(combinedArrays, null, 0)
  );

  const newProducts = {
    id_store: configs.stores[0],
    created_at: data_newProducts.created_at,
    products: combinedArrays,
  };

  return newProducts;
};
