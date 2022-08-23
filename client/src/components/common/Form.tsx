import React from 'react';
import { FormProps } from '../../types/types.form';

class Form extends React.Component<FormProps> {
  // static renderRadioButton({ name, id, label }: RadioButtonProps) {
  //   return <RadioButton label={label} name={name} id={id} />;
  // }

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
