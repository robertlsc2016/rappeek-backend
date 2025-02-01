export const filterProductsStoresGlobalSearch = async ({
  globalStoresProducts,
}: {
  globalStoresProducts: any;
}) => {
  const filteredArray = globalStoresProducts.map((store: any) => ({
    id: store.store_id,
    name: store.store_name,
    store_image: store.logo,
    products: store.products
      .filter(
        (product: any) =>
          product.id &&
          product.name &&
          product.image &&
          product.balance_price &&
          product.real_price &&
          product.price &&
          product.unit_type &&
          product.quantity &&
          product.stock
      )
      .sort((a: any, b: any) => a.price - b.price) // Ordena pelo preço (do mais barato ao mais caro)
      .map((product: any) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        balance_price: product.balance_price,
        real_price: product.real_price,
        price: product.price,
        unit_type: product.unit_type,
        quantity: product.quantity,
        stock: product.stock,
      })),
  }));

  return filteredArray;
};
