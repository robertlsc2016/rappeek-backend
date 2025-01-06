import db from "../createDatabase";
import { IStoreProductOffer } from "../interfaces/IStoreProductOffer";
import { StoreService } from "../services/storeService";
import moment from "moment";
moment().format();

export const getFistProductsDay = async (): Promise<
  IStoreProductOffer[] | IStoreProductOffer | any
> => {
  const stmt = db.prepare(`
    SELECT * 
    FROM lastRun
    ORDER BY id DESC
    LIMIT 1
  `);

  const lastElement: any = stmt.get();
  const initialRegistration: Date = lastElement?.created_at;

  const getAllConfigsStores = db.prepare(`SELECT * FROM stores`).all();

  const AllconfigsStores = getAllConfigsStores.map((configStore: any) => {
    return {
      state: {
        parent_store_type: configStore.parent_store_type,
        store_type: configStore.store_type,
      },
      stores: [Number(configStore.id_store)],
    };
  });

  // SE FOR MENOR QUE 5 MINUTOS, RETORNE O QUE TEM NO BANCO
  // if (initialRegistration && now - registrationTime < 300000) {
  //   console.log(now - registrationTime);

  //   console.log(
  //     "Menos de 5 minutos desde o último registro. Retornando dados do banco."
  //   );
  //   const stmt = db.prepare(`SELECT * FROM firstProductsDay`).all();
  //   return stmt;
  // }

  const AllStoreProductOffers = await Promise.all(
    AllconfigsStores.map(async (configStore: any) => {
      return {
        id_store: configStore.stores[0],
        products: await StoreService.getAllStoreProductOffers({
          configs: configStore,
          firstRequestDay: true
        }),
      };
    })
  );

  db.transaction(() => {
    AllStoreProductOffers.map((storeProductOffers) => {
      const insertQuery = `INSERT OR REPLACE INTO firstProductsDay (
        id_store, array_products_string) 
        VALUES (?, ?)`;

      const stmt = db.prepare(insertQuery);
      stmt.run(
        storeProductOffers.id_store,
        JSON.stringify(storeProductOffers.products, null, 0)
      );
    });

    const insertLastRunStmt = db.prepare("INSERT INTO lastRun DEFAULT VALUES");
    insertLastRunStmt.run();
  })();

  return AllStoreProductOffers
};
