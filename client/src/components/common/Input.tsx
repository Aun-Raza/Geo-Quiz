import * as React from 'react';
import { IInputProps } from '../../interfaces/IForm';

function Input({ label, value, onChange, type = 'text' }: IInputProps) {
  return (
    <div className='form-group'>
      <label htmlFor={label} className='form-label my-2'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='form-control'
        id={label}
      />
    </div>
  );
}

export default Input;
