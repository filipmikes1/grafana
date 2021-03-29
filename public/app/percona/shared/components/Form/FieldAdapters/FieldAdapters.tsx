import React, { FC } from 'react';
import { cx } from 'emotion';
import { Select, Spinner, useTheme } from '@grafana/ui';
import { getStyles } from './FieldAdapters.styles';
import { Field } from './Field';
import { Messages } from './FieldAdapters.messages';

// TODO: remove this once Select is available in platform-core
export const SelectFieldAdapter: FC<any> = ({
  input,
  className,
  options,
  label,
  meta,
  dataQa,
  noOptionsMessage,
  ...props
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Field label={label}>
      <div data-qa={dataQa}>
        <Select
          {...input}
          {...props}
          options={options}
          className={cx(styles.input, className)}
          invalid={meta.touched && meta.error}
          noOptionsMessage={noOptionsMessage}
        />
        <div data-qa="select-field-error-message" className={styles.errorMessage}>
          {meta.touched && meta.error}
        </div>
      </div>
    </Field>
  );
};

export const AsyncSelectFieldAdapter: FC<any> = ({
  input,
  className,
  loading,
  options,
  label,
  meta,
  dataQa,
  noOptionsMessage,
  ...props
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Field label={label}>
      <div data-qa={dataQa}>
        <div className={styles.asyncSelectWrapper}>
          <Select
            {...input}
            {...props}
            options={loading ? [] : options}
            className={cx(styles.input, className)}
            invalid={meta.touched && meta.error}
            noOptionsMessage={loading ? Messages.loadingOptions : noOptionsMessage}
          />
          {loading && <Spinner className={styles.selectSpinner} />}
        </div>
        <div data-qa="async-select-field-error-message" className={styles.errorMessage}>
          {meta.touched && meta.error}
        </div>
      </div>
    </Field>
  );
};
