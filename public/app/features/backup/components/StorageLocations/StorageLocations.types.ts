export enum LocationType {
  S3 = 'S3',
  CLIENT = 'Local Client',
  SERVER = 'Local Server',
}

export interface StorageLocation {
  name: string;
  description: string;
  type: LocationType;
  path: string;
}

export interface S3Location extends StorageLocation {
  accessKey: string;
  secretKey: string;
}

interface S3ConfigResponse {
  endpoint: string;
  access_key: string;
  secret_key: string;
}

interface FSConfigResponse {
  path: string;
}

export interface StorageLocationReponse {
  location_id?: string;
  name: string;
  description: string;
  s3_config?: S3ConfigResponse;
  pmm_server_config?: FSConfigResponse;
  pmm_client_config?: FSConfigResponse;
}

export interface StorageLocationListReponse {
  locations: StorageLocationReponse[];
}
