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
      "80": [0.8, 1],
      "60": [0.6, 0.8],
      "40": [0.4, 0.6],
      "10": [0.1, 0.4],
      "0": [0, 0.1],
    };

    // Inicializa as categorias de desconto
    const rangeProducts: any = {
      store_id,
      products_count: products.length,
      all: products,
      "80": [] as IProduct[],
      "60": [] as IProduct[],
      "40": [] as IProduct[],
      "10": [] as IProduct[],
      "0": [] as IProduct[],
    };

    // Itera sobre os produtos já ordenados de forma decrescente
    products.forEach((product) => {
      for (const [key, [min, max]] of Object.entries(discountRanges)) {
        if (product.discount >= min && product.discount < max) {
          rangeProducts[key].push(product);
          break; // Encerra o loop após encontrar o intervalo correto
        }
      }
    });

    return rangeProducts;
  } catch (err) {
    throw {
      message: "Erro ao reordenar os produtos recebidos da API",
      status: 503,
      error: err,
    };
  }
};
