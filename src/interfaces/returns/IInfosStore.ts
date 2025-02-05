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
    
    parent_store_type: string;
    store_type: string;
}


export interface IStoreType {
    store_type_group: {
        group: string;
        store_type: string;
    };
}