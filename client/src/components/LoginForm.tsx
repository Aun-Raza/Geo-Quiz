import React, { Fragment } from 'react';
import { useState } from 'react';
import { ILoginProps } from '../interfaces/IUser';
import Form from './common/Form';
const { renderInputText, renderSubmitButton } = Form;

interface LoginFormProps {
  loginUser: ({ username, password }: ILoginProps) => void;
}

function LoginForm({ loginUser }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    loginUser({ username, password });
  }

  return (
    <Fragment>
      <h2 className='my-3'>Login Form</h2>
      <Form onSubmit={submitForm}>
        {renderInputText({
          label: 'username',
          value: username,
          onChange: setUsername,
        })}
        {renderInputText({
          label: 'password',
          value: password,
          onChange: setPassword,
        })}
        {renderSubmitButton()}
      </Form>
    </Fragment>
  );
}

export default LoginForm;
