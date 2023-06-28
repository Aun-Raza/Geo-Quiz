import { Fragment, useState, useEffect } from 'react';
import { QuizTableProps } from '../types/index';
import QuizService from '../services/service.quiz';
import { Link } from 'react-router-dom';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<QuizTableProps[]>([]);

  useEffect(() => {
    populateQuizzes();
  }, []);

  async function populateQuizzes() {
    const { data: quizzes } = await QuizService.getQuizzes();
    setQuizzes(quizzes);
  }

  return (
    <Fragment>
      <h1 className='text-4xl w-fit mx-auto'>Quizzes</h1>
      <button className='btn mx-auto mt-4'>
        <Link to={'/add-quiz'}>Add Quiz</Link>
      </button>
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
              <td className='p-3'>{owner.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default QuizzesPage;
