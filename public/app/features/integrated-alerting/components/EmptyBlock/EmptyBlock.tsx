import { useStyles } from '@grafana/ui';
import React from 'react';
import { FC } from 'react';
import { getStyles } from './EmptyBlock.styles';

export const EmptyBlock: FC = ({ children, ...props }) => {
  const style = useStyles(getStyles);

  return (
    <div className={style.emptyBlockWrapper} {...props}>
      {children}
    </div>
  );
};
