import { filterProducts } from "./filterProducts";
const _ = require("lodash");

export const clearRequest = async (data: any) => {
  const filteredProductsList1 = await filterProducts(data[0], 0);
  const filteredProductsList2 = await filterProducts(data[1], 3);

  const allProducts = [...filteredProductsList1, ...filteredProductsList2];

  const uniqueProducts = _.uniqBy(allProducts, "id").filter(
    (product: any) => product.discount > 0
  );

  return uniqueProducts;
};
