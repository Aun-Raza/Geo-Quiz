/* eslint-disable indent */
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MultipleChoiceProps,
  QuizFormProps,
  TrueFalseProps,
} from '../types/types.quiz';
import QuizService from '../services/quizzes';
import { useNavigate } from 'react-router-dom';
import Form from './common/Form';
const { renderRadioButtons, renderSubmitButton } = Form;

function QuizForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizFormProps>();

  useEffect(() => {
    populateQuiz();
  }, []);

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
  }

  async function populateQuiz() {
    try {
      const { data: quiz } = await QuizService.getQuiz(id);
      setQuiz(quiz);
    } catch (error) {
      navigate('/not-found');
    }
  }

  function renderQuestion(question: MultipleChoiceProps | TrueFalseProps) {
    const { name, type } = question;
    const radioButtonsJSX =
      type === 'Multiple-Choice'
        ? renderRadioButtons({ labels: question.answers, name })
        : renderRadioButtons({
            labels: ['true', 'false'],
            name,
          });

    return (
      <div className='m-4 border p-3 rounded' key={name + type}>
        <h3>{name}</h3>
        {radioButtonsJSX}
      </div>
    );
  }

  if (quiz) {
    const { title, owner, questions } = quiz;
    return (
      <Fragment>
        <h2 className='mx-4 mt-4'>{title}</h2>
        <span className='mx-4'> {owner.username}</span>
        <Form onSubmit={submitForm}>
          {questions.map((question) => {
            return renderQuestion(question);
          })}
          {renderSubmitButton()}
        </Form>
      </Fragment>
    );
  } else return null;
}

export default QuizForm;
