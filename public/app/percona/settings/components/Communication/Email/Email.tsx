import { withTypes } from 'react-final-form';
import React, { FC, useState } from 'react';
import { Button, Spinner, useTheme } from '@grafana/ui';
import { TextInputField, PasswordInputField, validators, RadioButtonGroupField } from '@percona/platform-core';
import { LinkTooltip } from 'app/percona/shared/components/Elements/LinkTooltip/LinkTooltip';
import { getSettingsStyles } from '../../../Settings.styles';
import { Messages } from '../Communication.messages';
import { isEmailFieldNeeded, getInitialValues } from './Email.utils';
import { emailOptions } from './Email.constants';
import { EmailProps, FormEmailSettings } from './Email.types';
import { EmailAuthType, EmailSettings } from 'app/percona/settings/Settings.types';

export const Email: FC<EmailProps> = ({ updateSettings, settings }) => {
  const theme = useTheme();
  const settingsStyles = getSettingsStyles(theme);
  const [loading, setLoading] = useState(false);

  const applyChanges = (values: FormEmailSettings) => {
    const baseSettings: EmailSettings = { ...values };

    if (values.authType === EmailAuthType.PLAIN) {
      baseSettings.identity = btoa(`${values.username}${values.password}`);
    } else if (values.authType === EmailAuthType.CRAM) {
      baseSettings.secret = baseSettings.password;
    }

    Object.keys(baseSettings).forEach((field: keyof EmailSettings) => {
      if (!isEmailFieldNeeded(field, values.authType)) {
        delete baseSettings[field];
      }
    });

    updateSettings(
      {
        email_alerting_settings: baseSettings,
      },
      setLoading
    );
  };

  const initialValues = getInitialValues(settings);
  const { Form } = withTypes<FormEmailSettings>();

  return (
    <>
      <Form
        onSubmit={applyChanges}
        initialValues={initialValues}
        render={({ handleSubmit, valid, pristine, values }) => (
          <form className={settingsStyles.emailForm} onSubmit={handleSubmit}>
            <div className={settingsStyles.labelWrapper}>
              <span>{Messages.fields.smarthost.label}</span>
              <LinkTooltip
                tooltipText={Messages.fields.smarthost.tooltipText}
                link={Messages.fields.smarthost.tooltipLink}
                linkText={Messages.fields.smarthost.tooltipLinkText}
                icon="info-circle"
              />
            </div>
            <TextInputField name="smarthost" validators={[validators.required]} />

            <div className={settingsStyles.labelWrapper}>
              <span>{Messages.fields.hello.label}</span>
              <LinkTooltip
                tooltipText={Messages.fields.hello.tooltipText}
                link={Messages.fields.hello.tooltipLink}
                linkText={Messages.fields.hello.tooltipLinkText}
                icon="info-circle"
              />
            </div>
            <TextInputField validators={[validators.required]} name="hello" />

            <div className={settingsStyles.labelWrapper}>
              <span>{Messages.fields.from.label}</span>
              <LinkTooltip
                tooltipText={Messages.fields.from.tooltipText}
                link={Messages.fields.from.tooltipLink}
                linkText={Messages.fields.from.tooltipLinkText}
                icon="info-circle"
              />
            </div>
            <TextInputField name="from" validators={[validators.required]} />

            <div className={settingsStyles.labelWrapper}>
              <span>{Messages.fields.type.label}</span>
              <LinkTooltip
                tooltipText={Messages.fields.type.tooltipText}
                link={Messages.fields.type.tooltipLink}
                linkText={Messages.fields.type.tooltipLinkText}
                icon="info-circle"
              />
            </div>
            <RadioButtonGroupField
              className={settingsStyles.authRadioGroup}
              options={emailOptions}
              name="authType"
              fullWidth
            />

            <>
              <div className={settingsStyles.labelWrapper}>
                <span>{Messages.fields.username.label}</span>
                <LinkTooltip
                  tooltipText={Messages.fields.username.tooltipText}
                  link={Messages.fields.username.tooltipLink}
                  linkText={Messages.fields.username.tooltipLinkText}
                  icon="info-circle"
                />
              </div>
              <TextInputField
                disabled={values.authType === EmailAuthType.NONE}
                validators={[validators.required]}
                name="username"
              />
            </>

            <>
              <div className={settingsStyles.labelWrapper}>
                <span>{Messages.fields.password.label}</span>
                <LinkTooltip
                  tooltipText={Messages.fields.password.tooltipText}
                  link={Messages.fields.password.tooltipLink}
                  linkText={Messages.fields.password.tooltipLinkText}
                  icon="info-circle"
                />
              </div>
              <PasswordInputField
                disabled={values.authType === EmailAuthType.NONE}
                validators={[validators.required]}
                name="password"
              />
            </>

            <Button
              className={settingsStyles.actionButton}
              type="submit"
              disabled={!valid || pristine || loading}
              data-qa="email-settings-submit-button"
            >
              {loading && <Spinner />}
              {Messages.actionButton}
            </Button>
          </form>
        )}
      />
    </>
  );
};
