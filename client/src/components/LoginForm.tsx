import * as React from 'react';
import { useState } from 'react';
import { loginProps } from '../interfaces/User';
import Form from './common/Form';
import { InputProps } from '../interfaces/Form';

interface LoginFormProps {
    doLogin: ({ username, password }: loginProps) => void;
}

function LoginForm({ doLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    doLogin({ username, password });
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

  return <Form onSubmit={submitForm} inputs={inputs} />;
}

export default LoginForm;
