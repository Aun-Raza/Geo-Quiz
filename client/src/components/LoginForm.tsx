import React, { Fragment } from 'react';
import { useState } from 'react';
import { loginProps } from '../interfaces/User';
import Form from './common/Form';
import { InputProps } from '../interfaces/Form';

interface LoginFormProps {
  loginUser: ({ username, password }: loginProps) => void;
}

function LoginForm({ loginUser }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    loginUser({ username, password });
  }

  const inputs: InputProps[] = [
    {
      label: 'username',
      value: username,
      onChange: setUsername,
    },
    {
      label: 'password',
      value: password,
      onChange: setPassword,
      type: 'password',
    },
  ];

  return (
    <Fragment>
      <h2 className='my-3'>Login Form</h2>
      <Form onSubmit={submitForm} inputs={inputs} />
    </Fragment>
  );
}

export default LoginForm;
