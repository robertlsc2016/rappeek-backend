import db from "../createDatabase";
import { IConfigs } from "../interfaces/IConfigs";

export const productsByRange = async ({ configs }: { configs: IConfigs }) => {
  const productsStmt = db.prepare(`
      SELECT *, 
        CASE 
          WHEN discount >= 0.8 THEN 80
          WHEN discount >= 0.6 THEN 60
          WHEN discount >= 0.4 THEN 40
          WHEN discount >= 0.1 THEN 10
          ELSE 0
        END AS discount_range
      FROM products
      WHERE store_id = ? AND discount > 0
      ORDER BY discount DESC
    `);

  const products: any = productsStmt.all(configs.store_id);

  return products;
};
