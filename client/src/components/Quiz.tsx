/* eslint-disable linebreak-style */
/* eslint-disable indent */
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QuizFormProps } from '../types/types.quiz';
import QuizService from '../services/quizzes';
import { useNavigate } from 'react-router-dom';
import Form, { renderSubmitButton } from './common/Form';
import Question from './Question';

function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizFormProps>();
  const [result, setResult] = useState<boolean[] | string>();

  useEffect(() => {
    populateQuiz();
  }, []);

  async function populateQuiz() {
    try {
      const { data: quiz } = await QuizService.getQuiz(id);
      setQuiz(quiz);
    } catch (error) {
      navigate('/not-found');
    }
  }

  function validateForm() {
    try {
      if (!quiz) throw new Error('The quiz form is not rendered properly');
      const result = quiz.questions.map(({ name, correctAnswer }) =>
        validateAnswer(name, correctAnswer)
      );
      setResult(result);
    } catch (ex: unknown) {
      const error = ex as Error;
      setResult(error.message);
    }
  }

  //TODO: TEMPLATE
  function validateAnswer(name: string, correctAnswer: string | boolean) {
    const getSelectedValue = document
      .querySelector(`input[name="${name}"]:checked`)
      ?.getAttribute('value');

    if (!getSelectedValue)
      throw new Error(`Question '${name}' must be answered`);

    return getSelectedValue === correctAnswer.toString() ? true : false;
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm();
  };

  if (!quiz) return null;
  const { title, owner, questions } = quiz;
  return (
    <Fragment>
      <h2 className='mx-4 mt-4'>{title}</h2>
      <span className='mx-4'> {owner.username}</span>
      <Form onSubmit={submitForm}>
        {questions.map((question) => {
          return (
            <Question key={question.name + question.type} question={question} />
          );
        })}
        {renderSubmitButton()}
      </Form>
      {result && (
        <div id='result' className='m-2 border p-2 rounded w-50'>
          {typeof result === 'object' ? JSON.stringify(result) : result}
        </div>
      )}
    </Fragment>
  );
}

export default Quiz;
