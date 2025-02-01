export const reorderProductsByRange = async ({
  products,
  store_id,
}: {
  products: any;
  store_id: number;
}) => {
  const rangeProducts: any = {
    store_id: store_id,
    products_count: products.length,
    all: products,
    80: [],
    60: [],
    40: [],
    10: [],
    0: [],
  };

  for (const product of products) {
    rangeProducts[product.discount_range].push(product);
  }

  return rangeProducts;
};
