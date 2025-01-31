import { IProduct } from "../interfaces/IProduct";

export const filterProducts = (data: any, initial_index: number) => {
  if (!(data && typeof data === "object" && "components" in data)) {
    return [];
  }

  return (
    data?.components
      ?.filter((component: any) => component.index >= initial_index)
      ?.flatMap((component: any) =>
        component.resource.products.map(
          ({
            id,
            product_id,
            name,
            price,
            discount,
            real_price,
            image_url,
            quantity,
            unit_type,
            pum,
            stock,
            navigation,
          }: IProduct) => ({
            id,
            product_id,
            name,
            price,
            discount,
            real_price,
            image_url,
            quantity,
            unit_type,
            pum,
            stock,
            navigation,
          })
        )
      ) || []
  );
};
