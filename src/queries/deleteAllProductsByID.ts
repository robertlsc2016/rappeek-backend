import db from "../createDatabase";

export const deleteAllProductsByID = async ({
  store_id,
}: {
  store_id: number;
}) => {
  db.prepare(`DELETE FROM products WHERE store_id = ?`).run(store_id);
};
