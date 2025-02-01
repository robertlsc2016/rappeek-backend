import { filterProducts } from "./filterProducts";
const _ = require("lodash");

export const clearRequest = async (data: any) => {
  try {
    const filteredProductsList1 = await filterProducts(data[0], 0);
    const filteredProductsList2 = await filterProducts(data[1], 3);

    const allProducts = [...filteredProductsList1, ...filteredProductsList2];

    const uniqueProducts = _.uniqBy(allProducts, "id").filter(
      (product: any) => product.discount > 0
    );

    return uniqueProducts;
  } catch (err) {
    throw new Error(
      `[message: erro ao limpar dados recebidos da rappi] [error: ${err} ]`
    );
  }
};
