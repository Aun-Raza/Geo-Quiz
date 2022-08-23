import React, { Fragment } from 'react';
import { LoginFormProps } from '../types/types.user';
import Form from './common/Form';
import FormInputs from '../class/FormInputs';

class LoginForm<T extends LoginFormProps> extends FormInputs<T> {
  state = { username: '', password: '' };

  submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.loginUser({
      username,
      password,
    });
  };

  constructor(props: T) {
    super(props);
  }

  render() {
    const { username, password } = this.state;
    return (
      <Fragment>
        <h2 className='my-3'>Login Form</h2>
        <Form onSubmit={this.submitForm}>
          {this.renderInputText({
            label: 'username',
            value: username,
            onChange: (e) => this.setState({ username: e }),
          })}
          {this.renderInputText({
            label: 'password',
            value: password,
            onChange: (e) => this.setState({ password: e }),
          })}
          {this.renderSubmitButton()}
        </Form>
      </Fragment>
    );
  }
}

export default LoginForm;
