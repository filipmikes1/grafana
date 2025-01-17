import React from 'react';
import { mount } from 'enzyme';
import { dataTestId } from '@percona/platform-core';
import { DeleteNotificationChannelModal } from './DeleteNotificationChannelModal';
import { notificationChannelStubs } from '../__mocks__/notificationChannelStubs';

jest.mock('../NotificationChannel.service');
jest.mock('app/core/app_events');

describe('DeleteNotificationChannelModal', () => {
  it('should render delete modal', () => {
    const wrapper = mount(
      <DeleteNotificationChannelModal
        notificationChannel={notificationChannelStubs[0]}
        setVisible={jest.fn()}
        isVisible
      />
    );

    expect(wrapper.find(dataTestId('confirm-delete-modal-button'))).toBeTruthy();
    expect(wrapper.find(dataTestId('cancel-delete-modal-button'))).toBeTruthy();
  });

  it('should not render modal when visible is set to false', () => {
    const wrapper = mount(
      <DeleteNotificationChannelModal
        notificationChannel={notificationChannelStubs[0]}
        setVisible={jest.fn()}
        isVisible={false}
      />
    );

    expect(wrapper.contains(dataTestId('confirm-delete-modal-button'))).toBeFalsy();
  });

  it('should call setVisible on close', () => {
    const setVisible = jest.fn();
    const wrapper = mount(
      <DeleteNotificationChannelModal
        notificationChannel={notificationChannelStubs[0]}
        setVisible={setVisible}
        isVisible
      />
    );

    wrapper.find(dataTestId('modal-background')).simulate('click');

    expect(setVisible).toHaveBeenCalled();
  });
});
