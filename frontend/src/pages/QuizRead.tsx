/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizProps } from '../types';
import QuizService from '../services/service.quiz';
import { Link } from 'react-router-dom';

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
        <div className='flex items-center gap-2'>
          <input
            className='input-radio'
            id={`${name}1`}
            type='radio'
            name={name}
            value='true'
          />
          <label htmlFor={`${name}1`} className='text-xl'>
            True
          </label>
        </div>
        <div className='flex items-center gap-2'>
          <input
            className='input-radio'
            id={`${name}2`}
            type='radio'
            name={name}
            value='false'
          />
          <label htmlFor={`${name}2`} className='text-xl'>
            False
          </label>
        </div>
      </Fragment>
    );
  }

  function renderMultipleChoices(name: string, answers: string[]) {
    return answers.map((answer, index) => {
      return (
        <div
          key={`multipleChoice${name}${index}`}
          className='flex items-center gap-2'
        >
          <input
            id={`${name}${answer}`}
            className='input-radio'
            type='radio'
            name={name}
            value={answer}
          />
          <label className='text-xl' htmlFor={`${name}${answer}`}>
            {answer}
          </label>
        </div>
      );
    });
  }

  function renderResult(result: string | boolean[]) {
    const answers = result as boolean[];
    let correctAnswers = 0;
    answers.forEach((answer) => {
      if (answer === true) correctAnswers++;
    });

    const rate = correctAnswers / answers.length;
    let msg = ['', ''];
    switch (true) {
      case rate >= 0.9:
        msg = ['text-green-600', 'Excellent!'];
        break;
      case rate >= 0.5:
        msg = ['text-blue-600', 'Nice! Maybe Aim for Perfection?'];
        break;
      default:
        msg = ['text-red-600', 'You need to do better!'];
        break;
    }

    return (
      <div
        id='result'
        className='mt-6 w-fit mx-auto text-4xl font-mono flex flex-col gap-2 items-center'
      >
        <p className='text-5xl font-semibold'>YOUR SCORE</p>
        <div className={'font-semibold ' + msg[0]}>
          <span className='align-top'>{correctAnswers}</span>
          <span className='text-5xl'>/</span>
          <span className='text-5xl'>{answers.length}</span>
        </div>
        <p className={' ' + msg[0]}>{msg[1]}</p>
      </div>
    );
  }

  if (!quiz) return null;
  const { title, owner, questions } = quiz;
  return (
    <Fragment>
      <h1 className='mt-4 heading-1'>{title}</h1>
      <button className='btn block text-4xl w-fit mx-auto'>
        {owner.username}
      </button>
      <form onSubmit={submitForm}>
        {questions.map((question, index) => {
          const { name, type } = question;
          return (
            <div
              key={`questionBlock${index}`}
              className='border-2 shadow-lg relative rounded-lg w-1/2 mx-auto my-4 p-2 mb-2'
            >
              <h2 className='text-xl'>{name}</h2>
              {type === 'True-False'
                ? renderTrueFalse(name)
                : renderMultipleChoices(name, question.answers)}
              <h3 className='absolute top-0 right-1 text-3xl font-light'></h3>
            </div>
          );
        })}
        <input type='submit' className='btn btn_blue mx-auto' value='Submit' />
      </form>
      {result && renderResult(result)}
      <Link to='/'>
        <button className='btn mt-4 text-4xl mx-auto'>
          &larr; Return to Quizzes
        </button>
      </Link>
    </Fragment>
  );
};

export default QuizRead;
