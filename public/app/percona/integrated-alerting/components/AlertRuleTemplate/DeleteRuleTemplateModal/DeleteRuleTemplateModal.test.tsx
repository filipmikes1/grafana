import React from 'react';
import { mount } from 'enzyme';
import { dataTestId } from '@percona/platform-core';
import { DeleteRuleTemplateModal } from './DeleteRuleTemplateModal';
import { templateStubs } from '../__mocks__/alertRuleTemplateStubs';

jest.mock('../AlertRuleTemplate.service');
jest.mock('app/core/app_events');

describe('DeleteRuleTemplateModal', () => {
  it('should render delete modal', () => {
    const wrapper = mount(
      <DeleteRuleTemplateModal
        template={templateStubs[0]}
        setVisible={jest.fn()}
        getAlertRuleTemplates={jest.fn()}
        isVisible
      />
    );

    expect(wrapper.find(dataTestId('confirm-delete-modal-button'))).toBeTruthy();
    expect(wrapper.find(dataTestId('cancel-delete-modal-button'))).toBeTruthy();
  });

  it('should not render modal when visible is set to false', () => {
    const wrapper = mount(
      <DeleteRuleTemplateModal
        template={templateStubs[0]}
        setVisible={jest.fn()}
        getAlertRuleTemplates={jest.fn()}
        isVisible={false}
      />
    );

    expect(wrapper.contains(dataTestId('confirm-delete-modal-button'))).toBeFalsy();
  });

  it('should call setVisible on close', () => {
    const setVisible = jest.fn();
    const wrapper = mount(
      <DeleteRuleTemplateModal
        template={templateStubs[0]}
        setVisible={setVisible}
        getAlertRuleTemplates={jest.fn()}
        isVisible
      />
    );

    wrapper.find(dataTestId('modal-background')).simulate('click');

    expect(setVisible).toHaveBeenCalled();
  });
});
