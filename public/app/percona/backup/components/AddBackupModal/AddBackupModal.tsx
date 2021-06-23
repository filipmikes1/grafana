import React, { FC } from 'react';
import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import {
  CheckboxField,
  LoaderButton,
  Modal,
  RadioButtonGroupField,
  TextareaInputField,
  TextInputField,
  validators,
} from '@percona/platform-core';
import { Field, withTypes } from 'react-final-form';
import { AddBackupFormProps, AddBackupModalProps } from './AddBackupModal.types';
import { Messages } from './AddBackupModal.messages';
import { toFormBackup, isCronFieldDisabled, PERIOD_OPTIONS } from './AddBackupModal.utils';
import { AddBackupModalService } from './AddBackupModal.service';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { AsyncSelectField } from 'app/percona/shared/components/Form/AsyncSelectField';
import {
  DATA_MODEL_OPTIONS,
  DAY_OPTIONS,
  HOUR_OPTIONS,
  MAX_VISIBLE_OPTIONS,
  MINUTE_OPTIONS,
  MONTH_OPTIONS,
  WEEKDAY_OPTIONS,
} from './AddBackupModal.constants';
import { getStyles } from './AddBackupModal.styles';
import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import { MultiSelectField } from 'app/percona/shared/components/Form/MultiSelectField';

export const AddBackupModal: FC<AddBackupModalProps> = ({
  backup,
  isVisible,
  scheduleMode = false,
  onClose,
  onBackup,
}) => {
  const styles = useStyles(getStyles);
  const initialValues = toFormBackup(backup);
  const { Form } = withTypes<AddBackupFormProps>();

  const handleSubmit = (values: AddBackupFormProps) => onBackup(values);

  // TODO uncomment remaining fields when we support them
  return (
    <Modal title={scheduleMode ? Messages.scheduleTitle : Messages.title} isVisible={isVisible} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, valid, pristine, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div className={styles.formHalf}>
                <Field name="service" validate={validators.required}>
                  {({ input }) => (
                    <div>
                      <AsyncSelectField
                        label={Messages.serviceName}
                        isSearchable={false}
                        loadOptions={AddBackupModalService.loadServiceOptions}
                        defaultOptions
                        {...input}
                        data-qa="service-select-input"
                      />
                    </div>
                  )}
                </Field>
                <TextInputField
                  name="vendor"
                  label={Messages.vendor}
                  disabled
                  defaultValue={values.service ? DATABASE_LABELS[values.service.value?.vendor as Databases] : ''}
                />
              </div>
              <div className={styles.formHalf}>
                <TextInputField name="backupName" label={Messages.backupName} validators={[validators.required]} />
                <Field name="location" validate={validators.required}>
                  {({ input }) => (
                    <div>
                      <AsyncSelectField
                        label={Messages.location}
                        isSearchable={false}
                        loadOptions={AddBackupModalService.loadLocationOptions}
                        defaultOptions
                        {...input}
                        data-qa="location-select-input"
                      />
                    </div>
                  )}
                </Field>
              </div>
            </div>
            <RadioButtonGroupField
              disabled
              options={DATA_MODEL_OPTIONS}
              name="dataModel"
              label={Messages.dataModel}
              fullWidth
            />
            {/* {!scheduleMode && <RetryModeSelector disabled retryMode={RetryMode.MANUAL} />} */}
            <TextareaInputField name="description" label={Messages.description} />
            {scheduleMode && (
              <div className={styles.advancedGroup} data-qa="advanced-backup-fields">
                <h6 className={styles.advancedTitle}>Schedule</h6>
                <div>
                  <div className={styles.advancedRow}>
                    <Field name="period" validate={validators.required}>
                      {({ input }) => (
                        <div>
                          <SelectField {...input} options={PERIOD_OPTIONS} label={Messages.every} />
                        </div>
                      )}
                    </Field>
                    <Field name="month">
                      {({ input }) => (
                        <div>
                          <MultiSelectField
                            {...input}
                            closeMenuOnSelect={false}
                            options={MONTH_OPTIONS}
                            label={Messages.month}
                            isClearable
                            placeholder={Messages.every}
                            maxVisibleValues={MAX_VISIBLE_OPTIONS}
                            disabled={isCronFieldDisabled(values.period!.value!, 'month')}
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className={styles.advancedRow}>
                    <Field name="day">
                      {({ input }) => (
                        <div>
                          <MultiSelectField
                            {...input}
                            closeMenuOnSelect={false}
                            options={DAY_OPTIONS}
                            label={Messages.day}
                            isClearable
                            placeholder={Messages.every}
                            maxVisibleValues={MAX_VISIBLE_OPTIONS}
                            disabled={isCronFieldDisabled(values.period!.value!, 'day')}
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="weekDay">
                      {({ input }) => (
                        <div>
                          <MultiSelectField
                            {...input}
                            closeMenuOnSelect={false}
                            options={WEEKDAY_OPTIONS}
                            label={Messages.weekDay}
                            isClearable
                            placeholder={Messages.every}
                            maxVisibleValues={MAX_VISIBLE_OPTIONS}
                            disabled={isCronFieldDisabled(values.period!.value!, 'weekDay')}
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className={styles.advancedRow}>
                    <Field name="startHour">
                      {({ input }) => (
                        <div>
                          <MultiSelectField
                            {...input}
                            closeMenuOnSelect={false}
                            options={HOUR_OPTIONS}
                            label={Messages.startTime}
                            isClearable
                            placeholder={Messages.every}
                            maxVisibleValues={MAX_VISIBLE_OPTIONS}
                            disabled={isCronFieldDisabled(values.period!.value!, 'startHour')}
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="startMinute">
                      {({ input }) => (
                        <div>
                          <MultiSelectField
                            {...input}
                            closeMenuOnSelect={false}
                            options={MINUTE_OPTIONS}
                            label="&nbsp;"
                            isClearable
                            placeholder={Messages.every}
                            maxVisibleValues={MAX_VISIBLE_OPTIONS}
                            disabled={isCronFieldDisabled(values.period!.value!, 'startMinute')}
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                  {/* <div className={styles.advancedRow}>
                    <RetryModeSelector retryMode={values.retryMode} />
                  </div> */}
                  <div className={styles.advancedRow}>
                    {/* <CheckboxField fieldClassName={styles.checkbox} name="logs" label={Messages.fullLogs} /> */}
                    <CheckboxField fieldClassName={styles.checkbox} name="active" label={Messages.enabled} />
                  </div>
                </div>
              </div>
            )}
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-qa="backup-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {scheduleMode ? Messages.scheduleAction : Messages.backupAction}
              </LoaderButton>
              <Button data-qa="storage-location-cancel-button" variant="secondary" onClick={onClose}>
                {Messages.cancelAction}
              </Button>
            </HorizontalGroup>
          </form>
        )}
      />
    </Modal>
  );
};
