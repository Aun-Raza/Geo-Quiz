import React, { Fragment } from 'react';
import { Quiz } from '../interfaces/Quiz';
import Table from './common/Table';

interface QuizTableProps {
  quizzes: Quiz[];
}

function QuizTable({ quizzes }: QuizTableProps) {
  const data = {
    columns: ['_id', 'title', '# of questions', 'owner'],
    rows: quizzes.map(({ _id, title, questions, owner }) => {
      return {
        _id,
        title,
        questions: questions.length,
        owner: owner.username,
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
