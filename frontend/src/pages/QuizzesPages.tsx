import { Fragment } from 'react';
import { QuizTableProps } from '../types/index';
import { Link } from 'react-router-dom';

const QuizzesPage = ({ quizzes }: { quizzes: QuizTableProps[] }) => {
  return (
    <Fragment>
      <h1 className='text-4xl w-fit mx-auto'>Quizzes</h1>
      <table className='w-full mt-4'>
        <thead className=''>
          <tr className='text-left border-b-2'>
            <th className='p-3 pb-1'>_id</th>
            <th className='p-3 pb-1'>Title</th>
            <th className='p-3 pb-1'>Questions</th>
            <th className='p-3 pb-1'>Owner</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(({ _id, title, numQuestions, owner }) => (
            <tr key={_id} className='border-b-2'>
              <td className='p-3'>{_id.toString().slice(-6)}</td>
              <td className='p-3'>
                <Link
                  to={`/quiz/${_id}`}
                  className='underline text-blue-600 cursor-pointer hover:text-blue-900'
                >
                  {title}
                </Link>
              </td>
              <td className='p-3'>{numQuestions}</td>
              <td className='p-3'>
                <Link
                  to={`/user-profile/${owner._id}`}
                  className='underline text-blue-600 cursor-pointer hover:text-blue-900'
                >
                  {owner.username}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default QuizzesPage;
