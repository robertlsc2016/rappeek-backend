export interface IProduct {
  id: string;
  name: string;
  price: number;

  discount: number;
  real_price: number;
  image_url: string;

  quantity: number;
  unit_type: string;
  product_id: string;

  pum: string;
  stock: number;
  navigation: { deeplink: string; fallback: string };
}

export interface IProductGlobal {
  id: string;
  name: string;
  price: number;

  discount: number;
  real_price: number;
  image: string;

  quantity: number;
  unit_type: string;
  product_id: string;

  pum: string;
  stock: number;
}

export interface IStoresProductsGlobalSearch {
  store_id: number;
  store_name: string;
  logo: string;
  products: IProductGlobal[];
}
