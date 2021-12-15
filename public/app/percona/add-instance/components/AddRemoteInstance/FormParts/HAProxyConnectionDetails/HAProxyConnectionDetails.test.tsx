import React from 'react';
import { Form } from 'react-final-form';
import { fireEvent, render, screen } from '@testing-library/react';
import { HAProxyConnectionDetails } from './HAProxyConnectionDetails';

describe('HAProxy connection details:: ', () => {
  it('should trim username and password values right', async () => {
    render(<Form onSubmit={jest.fn()} render={() => <HAProxyConnectionDetails remoteInstanceCredentials={{}} />} />);

    const userNameTextInput = await screen.getByTestId('username-text-input');
    fireEvent.change(userNameTextInput, { target: { value: '    test     ' } });
    const passwordInput = await screen.getByTestId('password-password-input');
    fireEvent.change(passwordInput, { target: { value: '    test    ' } });

    expect(((await screen.findByTestId('username-text-input')) as HTMLInputElement).value).toEqual('test');
    expect(((await screen.findByTestId('password-password-input')) as HTMLInputElement).value).toEqual('test');
  });
});
