import * as React from 'react';
import { IInputProps } from '../../interfaces/IForm';
import Input from './Input';

interface FormProps {
  children: React.ReactNode[];
  onSubmit: (e: React.FormEvent) => void;
}

class Form extends React.Component<FormProps> {
  static renderInputText({ label, ...rest }: IInputProps) {
    return <Input key={label} label={label} {...rest} />;
  }

  static renderSubmitButton() {
    return (
      <button type='submit' className='btn btn-primary my-2'>
        Submit
      </button>
    );
  }

  constructor(props: FormProps) {
    super(props);
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit} className='w-50'>
        {this.props.children}
      </form>
    );
  }
}

export default Form;
