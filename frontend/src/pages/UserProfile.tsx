import { Link, useParams } from 'react-router-dom';
import { QuizTableProps, UserProps, UserQuizProps } from '../types';
import { Fragment, useEffect, useState } from 'react';
import UserService from '../services/service.user';

const UserProfile = ({
  quizzes,
  user,
  onDelete,
}: {
  quizzes: QuizTableProps[];
  user: UserProps | undefined;
  onDelete: (id: number) => void;
}) => {
  const { id } = useParams();
  const [targetedUser, setTargetedUser] = useState<UserQuizProps | undefined>();

  useEffect(() => {
    findTargetedUserById(id || '');
  }, []);

  async function findTargetedUserById(id: string) {
    try {
      const { data } = await UserService.getUser(id);
      setTargetedUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  function filterQuizzes(userQuizzesId: string[]) {
    return quizzes.filter((quiz) => {
      const index = userQuizzesId.findIndex(
        (quizId) => quizId === quiz._id.toString()
      );
      return index >= 0;
    });
  }

  return (
    <Fragment>
      <h1 className='text-4xl w-fit mx-auto'>User Profile</h1>
      {targetedUser && (
        <Fragment>
          <table className='mx-auto mt-4'>
            <tbody>
              <tr>
                <td className='p-3 border-e-2'>_id</td>
                <td className='ps-3'>{targetedUser._id}</td>
              </tr>
              <tr>
                <td className='p-3 border-e-2'>Email</td>
                <td className='ps-3'>{targetedUser.email}</td>
              </tr>
              <tr>
                <td className='p-3 border-e-2'>Username</td>
                <td className='ps-3'>{targetedUser.username}</td>
              </tr>
            </tbody>
          </table>
          <h2 className='text-4xl w-fit mx-auto mt-4'>
            {targetedUser.username} quizzes
          </h2>
          {user && user._id === targetedUser._id && (
            <button className='btn mx-auto mt-4 border-green-600 text-green-700'>
              <Link to={'/add-quiz'}>Add Quiz</Link>
            </button>
          )}
          <table className='w-full mt-4'>
            <thead className=''>
              <tr className='text-left border-b-2'>
                <th className='p-3 pb-1'>_id</th>
                <th className='p-3 pb-1'>Title</th>
                <th className='p-3 pb-1'>Questions</th>
                {user && user._id === targetedUser._id && (
                  <th className='p-3 pb-1'></th>
                )}
                {user && user._id === targetedUser._id && (
                  <th className='p-3 pb-1'></th>
                )}
              </tr>
            </thead>
            <tbody>
              {filterQuizzes(targetedUser.quizzes).map(
                ({ _id, title, numQuestions }) => (
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
                    {user && user._id === targetedUser._id && (
                      <td className='p-3'>
                        <button className='btn mx-auto mt-4 px-5 border-blue-500 text-blue-500'>
                          <Link to={`/edit-quiz/${_id}`}>Edit</Link>
                        </button>
                      </td>
                    )}
                    {user && user._id === targetedUser._id && (
                      <td className='p-3'>
                        <button
                          onClick={() => onDelete(_id)}
                          className='btn mx-auto mt-4 border-red-600 text-red-600'
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserProfile;
