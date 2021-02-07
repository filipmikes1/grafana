import { useStyles } from '@grafana/ui';
import React from 'react';
import { FC } from 'react';
import { getStyles } from './EmptyBlock.styles';
import { EmptyBlockFields } from './EmptyBlock.types';

export const EmptyBlock: FC<EmptyBlockFields> = ({ children, dataQa }) => {
  const style = useStyles(getStyles);

  return (
    <div className={style.emptyBlockWrapper} data-qa={dataQa}>
      {children}
    </div>
  );
};
