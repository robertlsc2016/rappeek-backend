export interface IInfosStoreResponse {
  address: string;
  name: string;
  store_id: string;

  store_type: IStoreType;

  "error_backend_stores-router-id"?: {
    http_status_code: number;
  };
}

export interface IBodyInfosStoreReturn {
  address: string;
  name: string;
  store_id: string;
  image: string;

  parent_store_type: string;
  store_type: string;
}

export interface IStoreType {
  image: string;
  store_type_group: {
    group: string;
    store_type: string;
  };
}
