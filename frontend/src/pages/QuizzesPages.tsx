import { Fragment } from 'react';
import { QuizTableProps } from '../types/index';
import { Link } from 'react-router-dom';

const QuizzesPage = ({ quizzes }: { quizzes: QuizTableProps[] }) => {
  return (
    <Fragment>
      <h1 className='heading-1'>All Available Quizzes</h1>
      <div className='w-fit center mx-auto mt-4 border-b-2 rounded-md px-2 pb-4 border-gray-700'>
        <label htmlFor='search' className='text-xl font-semibold'>
          Search Quizzes{' '}
          <span className='block text-sm text-gray-600'>(name or owner)</span>
        </label>
        <input id='search' type='text' className='input-search' />
        <hr className='h-1 bg-black w-max' />
      </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-6'>
        <table className='w-full text-xl text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3 bg-gray-50 dark:bg-gray-800'>Title</th>
              <th className='px-6 py-3'></th>
              <th className='px-6 py-3 bg-gray-50 dark:bg-gray-800'>
                #Questions
              </th>
              <th className='px-6 py-3 '>Description</th>
              <th className='px-6 py-3 bg-gray-50 dark:bg-gray-800'>Owner</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(({ _id, title, numQuestions, owner }) => (
              <tr
                key={_id}
                className='border-b border-gray-200 dark:border-gray-700'
              >
                <th
                  scope='row'
                  className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800'
                >
                  <Link
                    to={`/quiz/${_id}`}
                    className='cursor-pointer hover:text-blue-900'
                  >
                    <button className='btn'>{title}</button>
                  </Link>
                </th>
                <td className='px-6 py-4'>
                  <Link
                    to={`/quiz/${_id}`}
                    className='cursor-pointer hover:text-blue-900'
                  >
                    <button className='btn btn_green'>Start</button>
                  </Link>
                </td>
                <td className='px-6 py-4 bg-gray-50 dark:bg-gray-800 text-center'>
                  {numQuestions}
                </td>
                <td className='px-6 py-4 text-lg '>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste
                  quod nesciunt cupiditate quibusdam sed numquam dignissimos,
                  optio maxime accusantium?
                </td>
                <td className='px-6 py-4 bg-gray-50 dark:bg-gray-800'>
                  <Link
                    to={`/user-profile/${owner._id}`}
                    className='cursor-pointer hover:text-blue-900'
                  >
                    <button className='btn'>{owner.username}</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default QuizzesPage;
