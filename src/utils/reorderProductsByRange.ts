import { IProduct } from "./../interfaces/IProduct";

export const reorderProductsByRange = async ({
  products,
  store_id,
}: {
  products: IProduct[];
  store_id: number;
}): Promise<{
  store_id: number;
  products_count: number;
  all: IProduct[];
  [key: string]: IProduct[] | number;
}> => {
  try {
    const discountRanges: { [key: string]: [number, number] } = {
      "80": [0.8, 1], // Desconto >= 80%
      "60": [0.6, 0.8], // Desconto entre 60% e 79.9%
      "40": [0.4, 0.6], // Desconto entre 40% e 59.9%
      "10": [0.1, 0.4], // Desconto entre 10% e 39.9%
      "0": [0, 0.1], // Desconto < 10%
    };

    const rangeProducts = products.reduce(
      (acc: any, product: any) => {
        for (const [key, [min, max]] of Object.entries(discountRanges)) {
          if (product.discount >= min && product.discount < max) {
            acc[key].push(product);
            break;
          }
        }
        return acc;
      },
      {
        store_id,
        products_count: products.length,
        all: products,
        "80": [] as IProduct[],
        "60": [] as IProduct[],
        "40": [] as IProduct[],
        "10": [] as IProduct[],
        "0": [] as IProduct[],
      }
    );

    return rangeProducts;
  } catch (err) {
    throw new Error("erro ao reordenar os produtos recebidos da api");
  }
};
