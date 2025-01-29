export interface IProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  real_price: number;
  image_url: string;
  quantity: number;
  unit_type: string;

  pum: string;
  stock: number;
  navigation: any
}
