import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { getStyles } from './Breadcrumb.styles';
import { BreadcrumbSections } from './BreadcrumbSections';
import { BreadcrumbProps } from './Breadcrumb.types';

export const Breadcrumb: FC<BreadcrumbProps> = ({ pageModel, currentLocation }) => {
  const styles = useStyles(getStyles);

  return (
    <div data-testid="breadcrumb" className={styles.breadcrumb}>
      <BreadcrumbSections pageModel={pageModel} currentLocation={currentLocation} />
    </div>
  );
};
