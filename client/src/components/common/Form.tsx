import React from 'react';
import { FormProps } from '../../types/types.form';
import {
  InputProps,
  RadioButtonProps,
  RadioButtonsProps,
} from '../../types/types.form';
import { Input } from './Input';
import RadioButton from './RadioButton';

class Form extends React.Component<FormProps> {
  static renderInputText({ label, ...rest }: InputProps) {
    return <Input key={label} label={label} {...rest} />;
  }

  static renderRadioButtons({ labels, name }: RadioButtonsProps) {
    return labels.map((label, index) => {
      return Form.renderRadioButton({ label, name, id: label + index });
    });
  }

  private static renderRadioButton({ label, name, id }: RadioButtonProps) {
    return <RadioButton label={label} name={name} id={id} key={id} />;
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
    const { onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit} className='w-50'>
        {children}
      </form>
    );
  }
}

export default Form;
