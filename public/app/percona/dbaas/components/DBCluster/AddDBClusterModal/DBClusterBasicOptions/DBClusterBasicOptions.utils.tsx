import React, { FC } from 'react';
import { SelectableValue } from '@grafana/data';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { DatabaseOperators, OPERATORS } from './DBClusterBasicOptions.constants';
import { KubernetesOperatorStatus } from '../../../Kubernetes/OperatorStatusItem/KubernetesOperatorStatus/KubernetesOperatorStatus.types';
import { OptionContent } from '../../OptionContent/OptionContent';
import { Kubernetes } from '../../../Kubernetes/Kubernetes.types';
import { KubernetesOptionProps } from './DBClusterBasicOptions.types';
import { DatabaseVersion } from '../../DBCluster.types';

export const kubernetesClusterNameValidator = (value: string) => {
  const clusterNameRegexp = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

  return clusterNameRegexp.test(value) ? undefined : Messages.dbcluster.addModal.validationMessages.clusterName;
};

const KubernetesOption: FC<KubernetesOptionProps> = ({
  disabledOperators,
  availableOperators,
  kubernetesClusterName,
}) => (
  <OptionContent
    title={kubernetesClusterName}
    description={disabledOperators.length ? Messages.dbcluster.addModal.validationMessages.notInstalledOperator : ''}
    tags={availableOperators.map((databaseType) => DatabaseOperators[databaseType])}
    disabledTags={disabledOperators.map((databaseType) => DatabaseOperators[databaseType])}
    dataTestId="kubernetes-option"
  />
);

export const getKubernetesOptions = (kubernetes: Kubernetes[]) =>
  kubernetes
    .map((kubernetesCluster) => {
      const { kubernetesClusterName, operators } = kubernetesCluster;

      const availableOperators = OPERATORS.filter(
        (databaseType) => operators[databaseType].status === KubernetesOperatorStatus.ok
      );
      const disabledOperators = OPERATORS.filter(
        (databaseType) => operators[databaseType].status !== KubernetesOperatorStatus.ok
      );

      return {
        value: kubernetesClusterName,
        label: (
          <KubernetesOption
            kubernetesClusterName={kubernetesClusterName}
            availableOperators={availableOperators}
            disabledOperators={disabledOperators}
          />
        ),
        operators,
        availableOperators,
      };
    })
    .filter((operators) => operators.availableOperators.length);

export const optionRequired = (option: SelectableValue) =>
  option && option.label && option.value ? undefined : Messages.dbcluster.addModal.validationMessages.requiredField;

export const findDefaultDatabaseVersion = (versions: DatabaseVersion[]) => versions.find((version) => version.default);
