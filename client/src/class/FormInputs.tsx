import React from 'react';
import {
  InputProps,
  RadioButtonProps,
  RadioButtonsProps,
} from '../types/types.form';
import { Input } from '../components/common/Input';
import RadioButton from '../components/common/RadioButton';

abstract class FormInputs<T> extends React.Component<T> {
  renderInputText({ label, ...rest }: InputProps) {
    return <Input key={label} label={label} {...rest} />;
  }

  renderRadioButtons({ labels, name }: RadioButtonsProps) {
    return labels.map((label, index) => {
      return this.renderRadioButton({ label, name, id: label + index });
    });
  }

  private renderRadioButton({ label, name, id }: RadioButtonProps) {
    return <RadioButton label={label} name={name} id={id} key={id} />;
  }

  renderSubmitButton() {
    return (
      <button type='submit' className='btn btn-primary my-2'>
        Submit
      </button>
    );
  }
}

export default FormInputs;
