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
        _id: { text: _id, element: <Link to={`/quiz/${_id}`}>{_id}</Link> },
        title: { text: title },
        questions: { text: numQuestions },
        owner: { text: owner.username },
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
