import React, { FC, useContext } from 'react';
import { Form, Field } from 'react-final-form';
import { HorizontalGroup, Select, Button, useStyles } from '@grafana/ui';
import { Modal, LoaderButton, TextInputField, validators, logger } from '@percona/platform-core';
import { NotificationChannelProvider } from '../NotificationChannel.provider';
import { NotificationChannelRenderProps } from '../NotificationChannel.types';
import { AddNotificationChannelModalProps } from './AddNotificationChannelModal.types';
import { getStyles } from './AddNotificationChannelModal.styles';
import { Messages } from './AddNotificationChannelModal.messages';
import { TYPE_OPTIONS, TYPE_FIELDS_COMPONENT } from './AddNotificationChannel.constants';
import { NotificationChannelService } from '../NotificationChannel.service';

export const AddNotificationChannelModal: FC<AddNotificationChannelModalProps> = ({ isVisible, setVisible }) => {
  const styles = useStyles(getStyles);
  const { required } = validators;
  const initialValues = { type: TYPE_OPTIONS[0] };
  const { getNotificationChannels } = useContext(NotificationChannelProvider);
  const onSubmit = async (values: NotificationChannelRenderProps) => {
    try {
      await NotificationChannelService.add(values);
      setVisible(false);
      getNotificationChannels();
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <>
              <TextInputField name="name" label={Messages.fields.name} validators={[required]} />
              <Field name="type">
                {({ input }) => (
                  <>
                    <label className={styles.label} data-qa="type-field-label">
                      {Messages.fields.type}
                    </label>
                    <Select className={styles.select} options={TYPE_OPTIONS} {...input} />
                  </>
                )}
              </Field>
              {TYPE_FIELDS_COMPONENT[values.type.value]}
              <HorizontalGroup justify="center" spacing="md">
                <LoaderButton
                  data-qa="notification-channel-add-button"
                  size="md"
                  variant="primary"
                  disabled={!valid || pristine}
                  loading={submitting}
                >
                  {Messages.addAction}
                </LoaderButton>
                <Button
                  data-qa="notification-channel-cancel-button"
                  variant="secondary"
                  onClick={() => setVisible(false)}
                >
                  {Messages.cancelAction}
                </Button>
              </HorizontalGroup>
            </>
          </form>
        )}
      />
    </Modal>
  );
};
