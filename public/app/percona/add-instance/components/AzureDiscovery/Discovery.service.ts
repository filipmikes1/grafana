import { apiManagement } from 'app/percona/shared/helpers/api';
import { CancelToken } from 'axios';
import { AzureCredentialsForm } from './components/Credentials/Credentials.types';
import { AzureDatabaseInstances } from './Discovery.types';

class DiscoveryService {
  static async discoveryAzure(
    { azure_client_id, azure_client_secret, azure_tenant_id, azure_subscription_id }: AzureCredentialsForm,
    token?: CancelToken
  ) {
    return apiManagement.post<AzureDatabaseInstances, AzureCredentialsForm>(
      '/azure/AzureDatabase/Discover',
      {
        azure_client_id,
        azure_client_secret,
        azure_tenant_id,
        azure_subscription_id,
      },
      false,
      token
    );
  }
}

export default DiscoveryService;
