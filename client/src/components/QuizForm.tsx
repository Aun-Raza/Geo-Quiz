import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizService from '../services/quizzes';
import { MultipleChoiceProps, TrueFalseProps } from '../types/types.quiz';
import Form, { renderInputText, renderSubmitButton } from './common/Form';
import QuestionInput from './QuestionInput';

function QuizForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState<string>();
  const [questions, setQuestions] =
    useState<(MultipleChoiceProps | TrueFalseProps)[]>();

  useEffect(() => {
    assignQuizForm();
  }, []);

  async function assignQuizForm() {
    if (id === 'new') return;

    try {
      const {
        data: { title, questions },
      } = await QuizService.getQuiz(id);
      setTitle(title);
      setQuestions(questions);
    } catch (ex: unknown) {
      const error = ex as Error;
      console.log(error.message);
      navigate('/quizzes-table');
    }
  }

  // function addQuestion() {
  //   return;
  // }

  function edit(
    question: MultipleChoiceProps | TrueFalseProps | undefined,
    name: string
  ) {
    if (!questions || !question) return;

    //deep clone
    const clone = JSON.parse(JSON.stringify(questions));
    const index = questions.indexOf(question);
    clone[index].name = name;

    setQuestions(clone);
  }

  function renderQuestions() {
    if (questions) {
      return questions.map((question, index) => (
        <QuestionInput
          key={index}
          id={++index}
          onEdit={edit}
          question={question}
        />
      ));
    }
  }

  return (
    <Form
      onSubmit={() => {
        return;
      }}
    >
      <h2 className='my-3'>Edit</h2>
      {renderInputText({
        label: 'title',
        value: title || '',
        onChange: setTitle,
      })}
      {renderQuestions()}
      {renderSubmitButton()}
    </Form>
  );
}

export default QuizForm;
