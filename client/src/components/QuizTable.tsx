/* eslint-disable linebreak-style */
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { QuizProps } from '../types/types.quiz';
import Table from './common/Table';

interface QuizTableProps {
  quizzes: QuizProps[];
}

function QuizTable({ quizzes }: QuizTableProps) {
  const data = {
    columns: [
      { path: '_id' },
      { path: 'title' },
      { path: 'questions' },
      { path: 'owner' },
    ],
    rows: quizzes.map(({ _id, title, numQuestions, owner }) => {
      return {
        _id: { text: _id },
        title: {
          text: title,
          element: <Link to={`/quiz/${_id}`}>{title}</Link>,
        },
        questions: { text: numQuestions },
        owner: { text: owner.username },
        edit: {
          text: 'edit',
          element: (
            <button className='btn btn-outline-primary'>
              <Link to={`/quiz-form/${_id}`}>Edit</Link>
            </button>
          ),
        },
      };
    }),
  };

  return (
    <Fragment>
      <h2 className='my-3'>Quiz Table</h2>
      <Table data={data} />
    </Fragment>
  );
}

export default QuizTable;
