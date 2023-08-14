import { Fragment, useState } from 'react';
import { QuizTableProps } from '../types/index';
import { Link } from 'react-router-dom';

const QuizzesPage = ({ quizzes }: { quizzes: QuizTableProps[] }) => {
  const [search, setSearch] = useState('');

  function filterQuizzes() {
    if (!search) return quizzes;

    const regex = new RegExp(search, 'i');
    return quizzes.filter(
      (quiz) =>
        regex.test(quiz.owner!.username) ||
        regex.test(quiz.title) ||
        regex.test(quiz.description)
    );
  }

  return (
    <Fragment>
      <h1 className='heading-1'>Quizzes</h1>
      <div className='mt-8 relative z-0 group'>
        <label
          htmlFor='search'
          className='peer-focus:font-medium absolute text-lg font-semibold text-gray-700 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Search Quiz (title, desc, owner)
        </label>
        <input
          id='search'
          type='text'
          name='search'
          placeholder='john_doe'
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          className='block w-1/2 pt-4 pb-1 px-0 text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
        />
      </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-2'>
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
            {filterQuizzes().map(
              ({ _id, title, description, numQuestions, owner }) => (
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
                  <td className='px-6 py-4 text-lg '>{description}</td>
                  <td className='px-6 py-4 bg-gray-50 dark:bg-gray-800'>
                    <Link
                      to={`/user-profile/${owner._id}`}
                      className='cursor-pointer hover:text-blue-900'
                    >
                      <button className='btn'>{owner.username}</button>
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default QuizzesPage;
