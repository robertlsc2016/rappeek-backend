import { IProduct } from "../interfaces/returns/IProduct";

export const filterProducts = (data: any, initial_index: number) => {

  try {
    if (!(data && typeof data === "object")) {
      return [];
    }

    return (
      data?.filter((component: any) => component.index >= initial_index)
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
  } catch (err: any) {
    throw {
      message: "erro ao filtrar produtos recebidos da api do rappi",
      status: 503,
      error: err
    }
  }

};
