import React from 'react';
import { mount } from 'enzyme';
import { dataQa } from '@percona/platform-core';
import { Advanced } from './Advanced';
import { sttCheckIntervalsStub } from './__mocks__/stubs';

describe('Advanced::', () => {
  it('Renders correctly with props', () => {
    const root = mount(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        publicAddress="pmmtest.percona.com"
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const retentionInput = root.find(dataQa('retention-field-container')).find('input');
    const publicAddressInput = root.find(dataQa('publicAddress-text-input')).find('input');

    expect(retentionInput.prop('value')).toEqual(15);
    expect(publicAddressInput.prop('value')).toEqual('pmmtest.percona.com');
  });

  it("Can't change telemetry when stt is on", () => {
    const root = mount(
      <Advanced
        backupEnabled={false}
        dataRetention="1296000s"
        telemetryEnabled
        sttEnabled
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const telemetrySwitch = root.find('[data-qa="advanced-telemetry"]').find('input');

    expect(telemetrySwitch.prop('disabled')).toBeTruthy();
  });

  it("Can't change stt when telemetry is off", () => {
    const root = mount(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const sttSwitch = root.find('[data-qa="advanced-stt"]').find('input');

    expect(sttSwitch.prop('disabled')).toBeTruthy();
  });

  it("Can't change alerting when telemetry is off", () => {
    const root = mount(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        alertingEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const alertingSwitch = root.find('[data-qa="advanced-alerting"]').find('input');

    expect(alertingSwitch.prop('disabled')).toBeTruthy();
  });

  it('Calls apply changes', () => {
    const updateSettings = jest.fn();
    const root = mount(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={updateSettings}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );

    root
      .find('[data-qa="retention-field-container"]')
      .find('input')
      .simulate('change', { target: { value: '70' } });
    root.find('form').simulate('submit');

    expect(updateSettings).toHaveBeenCalled();
  });

  it('Sets correct URL from browser', () => {
    const oldLocation = window.location;

    delete window.location;
    window.location = Object.create({ ...oldLocation, hostname: 'pmmtest.percona.com' });

    const root = mount(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        backupEnabled={false}
        updatesDisabled
        updateSettings={() => {}}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );
    const publicAddressButton = root.find(dataQa('public-address-button')).find('button');

    publicAddressButton.simulate('click');
    root.update();

    const publicAddressInput = root.find(dataQa('publicAddress-text-input')).find('input');

    expect(publicAddressInput.prop('value')).toEqual('pmmtest.percona.com');
  });

  it('Does not include STT check intervals in the change request if STT checks are disabled', () => {
    const fakeUpdateSettings = jest.fn();

    const root = mount(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={false}
        updatesDisabled
        updateSettings={fakeUpdateSettings}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );

    root.find('form').simulate('submit');

    expect(fakeUpdateSettings.mock.calls[0][0].stt_check_intervals).toBeUndefined();
  });

  it('Includes STT check intervals in the change request if STT checks are enabled', () => {
    const fakeUpdateSettings = jest.fn();

    const root = mount(
      <Advanced
        dataRetention="1296000s"
        telemetryEnabled={false}
        sttEnabled={true}
        updatesDisabled
        updateSettings={fakeUpdateSettings}
        sttCheckIntervals={sttCheckIntervalsStub}
      />
    );

    root.find('form').simulate('submit');

    expect(fakeUpdateSettings.mock.calls[0][0].stt_check_intervals).toBeDefined();
  });
});