import React, { FC, useState } from 'react';
import { withTypes } from 'react-final-form';
import { logger, RadioButtonGroupField } from '@percona/platform-core';
import { Messages } from './ChangeCheckIntervalModal.messages';
import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import { LoaderButton, Modal } from '@percona/platform-core';
import { AppEvents } from '@grafana/data';
import { appEvents } from 'app/core/app_events';
import { CheckService } from 'app/percona/check/Check.service';
import { getStyles } from './ChangeCheckIntervalModal.styles';
import { ChangeCheckIntervalModalProps, ChangeCheckIntervalFormValues } from './types';
import { checkIntervalOptions } from './ChangeCheckIntervalModal.constants';
import { ChecksReloadContext } from '../AllChecks.context';

const { Form } = withTypes<ChangeCheckIntervalFormValues>();

export const ChangeCheckIntervalModal: FC<ChangeCheckIntervalModalProps> = ({
  interval,
  checkName,
  isVisible,
  setVisible,
}) => {
  const styles = useStyles(getStyles);
  const [pending, setPending] = useState(false);
  const checksReloadContext = React.useContext(ChecksReloadContext);

  const changeInterval = async ({ interval }: ChangeCheckIntervalFormValues) => {
    try {
      setPending(true);
      await CheckService.changeInterval({
        name: checkName,
        interval,
      });
      setVisible(false);
      await checksReloadContext.fetchChecks();
      appEvents.emit(AppEvents.alertSuccess, [Messages.getSuccess(checkName)]);
    } catch (e) {
      logger.error(e);
    } finally {
      setPending(false);
    }
  };

  const initialValues: ChangeCheckIntervalFormValues = {
    interval,
  };

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <div className={styles.content}>
        <h4 className={styles.title}>{Messages.getDescription(checkName)}</h4>
        <Form
          onSubmit={changeInterval}
          initialValues={initialValues}
          render={({ handleSubmit, pristine }) => (
            <form onSubmit={handleSubmit}>
              <div className={styles.intervalRadioWrapper}>
                <RadioButtonGroupField name="interval" options={checkIntervalOptions} />
              </div>
              <HorizontalGroup justify="center" spacing="md">
                <LoaderButton
                  disabled={pristine}
                  loading={pending}
                  variant="destructive"
                  size="md"
                  data-qa="change-check-interval-modal-save"
                >
                  {Messages.save}
                </LoaderButton>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setVisible(false)}
                  data-qa="change-check-interval-modal-cancel"
                >
                  {Messages.cancel}
                </Button>
              </HorizontalGroup>
            </form>
          )}
        />
      </div>
    </Modal>
  );
};
