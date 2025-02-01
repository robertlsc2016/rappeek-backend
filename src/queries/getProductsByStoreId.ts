import db from "../createDatabase";

export const getProductsByStoreId = ({ store_id }: { store_id: number }) => {
  const productsInDB = db
    .prepare(`SELECT * FROM products WHERE store_id = ?`)
    .all(store_id);

  return productsInDB;
};
