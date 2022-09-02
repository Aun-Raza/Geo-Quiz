import React, { useEffect, useState } from 'react';
import { MultipleChoiceProps, TrueFalseProps } from '../types/types.quiz';
import { renderInputText } from './common/Form';

interface QuestionInputProps {
  question: MultipleChoiceProps | TrueFalseProps | undefined;
  id: number;
  onEdit: (
    question: MultipleChoiceProps | TrueFalseProps | undefined,
    name: string
  ) => void;
}

function QuestionInput({ question, id, onEdit }: QuestionInputProps) {
  const [name, setName] = useState<string>();

  useEffect(() => {
    populateName();
  }, []);

  useEffect(() => {
    onEdit(question, name || '');
  }, [name]);

  function populateName() {
    if (question) setName(question.name);
    else setName('');
  }

  return (
    <div className='border my-2 p-2'>
      <h3>{`Quesiton #${id}`}</h3>
      {renderInputText({ label: 'name', value: name || '', onChange: setName })}
    </div>
  );
}

export default QuestionInput;
