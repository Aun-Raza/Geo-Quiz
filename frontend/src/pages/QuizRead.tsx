import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizProps } from '../types';
import QuizService from '../services/service.quiz';

const QuizRead = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizProps>();
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

  function validateQuiz() {
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

  function validateAnswer(name: string, correctAnswer: string | boolean) {
    const getSelectedValue = document
      .querySelector(`input[name="${name}"]:checked`)
      ?.getAttribute('value');

    return getSelectedValue === correctAnswer.toString() ? true : false;
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    validateQuiz();
  };

  function renderTrueFalse(name: string) {
    return (
      <Fragment>
        <div className='flex gap-1'>
          <input id={`${name}1`} type='radio' name={name} value='true' />
          <label htmlFor={`${name}1`}>True</label>
        </div>
        <div className='flex gap-1'>
          <input id={`${name}2`} type='radio' name={name} value='false' />
          <label htmlFor={`${name}2`}>False</label>
        </div>
      </Fragment>
    );
  }

  function renderMultipleChoices(name: string, answers: string[]) {
    return answers.map((answer, index) => {
      return (
        <div key={`multipleChoice${name}${index}`} className='flex gap-1'>
          <input
            id={`${name}${answer}`}
            type='radio'
            name={name}
            value={answer}
          />
          <label htmlFor={`${name}${answer}`}>{answer}</label>
        </div>
      );
    });
  }

  if (!quiz) return null;
  const { title, owner, questions } = quiz;
  return (
    <Fragment>
      <h1 className='mt-4 text-4xl'>{title}</h1>
      <span className='ms-2 block mb-4'>By {owner.username}</span>
      <form onSubmit={submitForm}>
        {questions.map((question, index) => {
          const { name, type } = question;
          return (
            <div
              key={`questionBlock${index}`}
              className='border-2 rounded-sm p-2 mb-2'
            >
              <h2>{name}</h2>
              {type === 'True-False'
                ? renderTrueFalse(name)
                : renderMultipleChoices(name, question.answers)}
            </div>
          );
        })}
        <input
          type='submit'
          className='btn bg-blue-400 mx-auto'
          value='Submit'
        />
      </form>
      {result && (
        <div id='result' className='m-2 border p-2 rounded w-50'>
          {typeof result === 'object' ? JSON.stringify(result) : result}
        </div>
      )}
    </Fragment>
  );
};

export default QuizRead;
