/* eslint-disable linebreak-style */
/* eslint-disable indent */
import React from 'react';
import { TrueFalseProps, MultipleChoiceProps } from '../types/types.quiz';
import { renderRadioButtons } from './common/Form';

interface QuestionProps {
  question: TrueFalseProps | MultipleChoiceProps;
}

function Question({ question }: QuestionProps) {
  const { name, type } = question;
  const radioButtonsJSX =
    type === 'Multiple-Choice'
      ? renderRadioButtons({ labels: question.answers, name })
      : renderRadioButtons({
          labels: ['true', 'false'],
          name,
        });

  return (
    <div className='m-4 border p-3 rounded'>
      <h3>{name}</h3>
      {radioButtonsJSX}
    </div>
  );
}
export default Question;
