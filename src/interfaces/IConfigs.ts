export interface IConfigs {
  limit: number;
  offset: number;
  state: {
    aisle_id: string;
    parent_id: string;
    lat: string;
    lng: string;
    parent_store_type: string;
    store_type: string;
  };
  stores: number[];
}
