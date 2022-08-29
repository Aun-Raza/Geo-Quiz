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

function renderRadioButton({ label, name, id }: RadioButtonProps) {
  return <RadioButton label={label} name={name} id={id} key={id} />;
}

export function renderInputText({ label, ...rest }: InputProps) {
  return <Input key={label} label={label} {...rest} />;
}

export function renderRadioButtons({ labels, name }: RadioButtonsProps) {
  return labels.map((label, index) => {
    return renderRadioButton({ label, name, id: label + index });
  });
}

export function renderSubmitButton() {
  return (
    <button type='submit' className='btn btn-primary my-2'>
      Submit
    </button>
  );
}

export default Form;
