import React from 'react';
import { RadioButtonProps } from '../../types/types.form';

function RadioButton({ name, id, label }: RadioButtonProps) {
  return (
    <div className='form-check'>
      <input className='form-check-input' type='radio' name={name} id={id} />
      <label className='form-check-label' htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default RadioButton;
