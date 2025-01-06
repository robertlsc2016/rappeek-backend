import { IConfigs } from "../interfaces/IConfigs";
import { IProduct } from "../interfaces/IProduct";
import { StoreService } from "../services/storeService";

export const filterNewProducts = async ({ configs }: { configs: IConfigs }) => {
  const liveProductsStore: IProduct[] =
    await StoreService.getAllStoreProductOffers({
      configs: configs,
      firstRequestDay: false,
    });

  const oldProducts: any = await StoreService.getAllProductsDayByIdStore({
    id_store: configs.stores[0],
  });

  const _oldProducts = oldProducts?.array_products_string
    ? JSON.parse(oldProducts.array_products_string)
    : [];

  if (_oldProducts.length === 0) return liveProductsStore;


  const isObjectEqual = (obj1: any, obj2: any) => {
    return (
      obj1.id === obj2.id &&
      obj1.price === obj2.price
    );
  };

  const uniqueInArray = liveProductsStore.filter(
    (obj2) => !_oldProducts.some((obj1: any) => isObjectEqual(obj1, obj2))
  );

  return uniqueInArray;
};
