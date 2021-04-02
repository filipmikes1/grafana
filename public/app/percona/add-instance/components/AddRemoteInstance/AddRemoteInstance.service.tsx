import { apiManagement } from 'app/percona/shared/helpers/api';
import {
  RemoteInstanceExternalservicePayload,
  RemoteInstancePayload,
  TrackingOptions,
} from './AddRemoteInstance.types';
import { InstanceTypes } from '../../panel.types';

class AddRemoteInstanceService {
  static async addMysql(body: RemoteInstancePayload) {
    return apiManagement.post<any, RemoteInstancePayload>('/MySQL/Add', body);
  }

  static async addPostgresql(body: RemoteInstancePayload) {
    return apiManagement.post<any, RemoteInstancePayload>('/PostgreSQL/Add', body);
  }

  static async addProxysql(body: RemoteInstancePayload) {
    return apiManagement.post<any, RemoteInstancePayload>('/ProxySQL/Add', body);
  }

  static async addHaproxy(body: RemoteInstancePayload) {
    return apiManagement.post<any, RemoteInstancePayload>('/HAProxy/Add', body);
  }

  static async addMongodb(body: RemoteInstancePayload) {
    return apiManagement.post<any, RemoteInstancePayload>('/MongoDB/Add', body);
  }

  static async addRDS(body: RemoteInstancePayload) {
    return apiManagement.post<any, RemoteInstancePayload>('/RDS/Add', body);
  }
  static async addAzure(body: RemoteInstancePayload) {
    return apiManagement.post<any, RemoteInstancePayload>('/azure/AzureDatabase/Add', body);
  }

  static async addExternal(body: any) {
    return apiManagement.post<any, any>('/External/Add', body);
  }

  static addRemote(type: InstanceTypes, data: any) {
    switch (type) {
      case InstanceTypes.mongodb:
        return AddRemoteInstanceService.addMongodb(toPayload(data));
      case InstanceTypes.mysql:
        return AddRemoteInstanceService.addMysql(toPayload(data));
      case InstanceTypes.postgresql:
        return AddRemoteInstanceService.addPostgresql(toPayload(data));
      case InstanceTypes.proxysql:
        return AddRemoteInstanceService.addProxysql(toPayload(data));
      case InstanceTypes.haproxy:
        return AddRemoteInstanceService.addHaproxy(toExternalServicePayload(data));
      case InstanceTypes.external:
        return AddRemoteInstanceService.addExternal(toExternalServicePayload(data));
      default:
        throw new Error('Unknown instance type');
    }
  }
}

export default AddRemoteInstanceService;

export const toPayload = (values: any, discoverName?: string): RemoteInstancePayload => {
  const data = { ...values };

  if (values.custom_labels) {
    data.custom_labels = data.custom_labels
      .split(/[\n\s]/)
      .filter(Boolean)
      .reduce((acc: any, val: string) => {
        const [key, value] = val.split(':');

        acc[key] = value;

        return acc;
      }, {});
  }

  if (!values.isAzure) {
    if (data.isRDS && data.tracking === TrackingOptions.pgStatements) {
      data.qan_postgresql_pgstatements = true;
    } else if (!data.isRDS && data.tracking === TrackingOptions.pgStatements) {
      data.qan_postgresql_pgstatements_agent = true;
    } else if (!data.isRDS && data.tracking === TrackingOptions.pgMonitor) {
      data.qan_postgresql_pgstatmonitor_agent = true;
    }
  }

  data.service_name = data.serviceName;
  delete data.serviceName;

  if (!data.service_name) {
    data.service_name = data.address;
  }

  if (!values.isAzure && data.add_node === undefined) {
    data.add_node = {
      node_name: data.service_name,
      node_type: 'REMOTE_NODE',
    };
  }

  if (values.isRDS && discoverName) {
    data.engine = discoverName;
  }

  if (values.isAzure && discoverName) {
    data.type = discoverName;
  }

  if (!data.pmm_agent_id) {
    // set default value for pmm agent id
    data.pmm_agent_id = 'pmm-server';
  }

  if (values.isRDS) {
    data.rds_exporter = true;
  }

  if (values.isAzure) {
    data.node_name = data.service_name;
    if (data.tracking === TrackingOptions.pgStatements || data.qan_mysql_perfschema) {
      data.qan = true;
    }
  }

  data.metrics_mode = 1;
  delete data.tracking;

  return data;
};

export const toExternalServicePayload = (values: any): RemoteInstanceExternalservicePayload => {
  const data = { ...values };

  if (values.custom_labels) {
    data.custom_labels = data.custom_labels
      .split(/[\n\s]/)
      .filter(Boolean)
      .reduce((acc: any, val: string) => {
        const [key, value] = val.split(':');

        acc[key] = value;

        return acc;
      }, {});
  }

  delete data.tracking;
  data.service_name = data.serviceName;
  delete data.serviceName;

  if (!data.service_name) {
    data.service_name = data.address;
  }

  if (data.add_node === undefined) {
    data.add_node = {
      node_name: data.service_name,
      node_type: 'REMOTE_NODE',
    };
  }

  data.listen_port = data.port;
  delete data.port;

  data.metrics_mode = 1;

  return data;
};
