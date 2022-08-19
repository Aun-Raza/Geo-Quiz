import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { IQuiz } from '../interfaces/IQuiz';
import Table from './common/Table';

interface IQuizTableProps {
  quizzes: IQuiz[];
}

function QuizTable({ quizzes }: IQuizTableProps) {
  const data = {
    columns: [
      { path: '_id' },
      { path: 'title' },
      { path: 'questions' },
      { path: 'owner' },
    ],
    rows: quizzes.map(({ _id, title, questions, owner }) => {
      return {
        _id: { text: _id, element: <Link to={`/quiz/${_id}`}>{_id}</Link> },
        title: { text: title },
        questions: { text: questions.length },
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
