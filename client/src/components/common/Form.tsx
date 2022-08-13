import * as React from 'react';
import { FormProps } from '../../interfaces/Form';
import Input from './Input';

function Form({ onSubmit, inputs }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="w-50">
      {inputs.map(({ label, ...rest }) => {
        return <Input key={label} label={label} {...rest} />;
      })}
      <button type="submit" className="btn btn-primary my-2">
                Submit
      </button>
    </form>
  );
}

export default Form;
