import React, { Component, Fragment } from 'react';
import { LoginFormProps } from '../types/types.user';
import Form from './common/Form';
const { renderInputText, renderSubmitButton } = Form;

class LoginForm extends Component<LoginFormProps> {
  state = { username: '', password: '' };

  submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.loginUser({
      username,
      password,
    });
  };

  constructor(props: LoginFormProps) {
    super(props);
  }

  render() {
    const { username, password } = this.state;
    return (
      <Fragment>
        <h2 className='my-3'>Login Form</h2>
        <Form onSubmit={this.submitForm}>
          {renderInputText({
            label: 'username',
            value: username,
            onChange: (e) => this.setState({ username: e }),
          })}
          {renderInputText({
            label: 'password',
            value: password,
            onChange: (e) => this.setState({ password: e }),
          })}
          {renderSubmitButton()}
        </Form>
      </Fragment>
    );
  }
}

export default LoginForm;
