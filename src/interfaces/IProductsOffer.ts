import { IProduct } from "./IProduct";

export interface IProductsOfferByRange {
    store_id: number;
    products_count: number;
    all: IProduct[];
    "80": IProduct[];
    "60": IProduct[];
    "40": IProduct[];
    "10": IProduct[];
    "0": IProduct[];
}