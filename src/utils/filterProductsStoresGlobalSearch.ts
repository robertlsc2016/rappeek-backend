import {
  IProduct,
  IProductGlobal,
  IStoresProductsGlobalSearch,
} from "../interfaces/returns/IProduct";
export const filterProductsStoresGlobalSearch = async ({
  globalStoresProducts,
}: {
  globalStoresProducts: IStoresProductsGlobalSearch[];
}) => {
  try {
    const filteredArray = globalStoresProducts.map(
      (store: IStoresProductsGlobalSearch) => ({
        id: store.store_id,
        name: store.store_name,
        store_image: store.logo,
        products: store.products
          .filter(
            (product: IProductGlobal) =>
              product.id &&
              product.name &&
              product.price &&
              product.discount &&
              product.real_price &&
              product.image &&
              product.quantity &&
              product.unit_type &&
              product.product_id &&
              product.pum &&
              product.stock
          )
          .sort((a: IProductGlobal, b: IProductGlobal) => a.price - b.price)
          .map((product: IProductGlobal) => ({
            id: product.id,
            name: product.name,
            price: product.price,

            discount: product.discount,
            real_price: product.real_price,
            image: product.image,

            quantity: product.quantity,
            unit_type: product.unit_type,
            product_id: product.product_id,

            pum: product.pum,
            stock: product.stock,
          })),
      })
    );

    return filteredArray;
  } catch (err: any) {
    throw {
      message: "erro ao filtrar produtos da pesquisa global recebidos da api",
      status: 503,
      error: err
    }
  }
};
