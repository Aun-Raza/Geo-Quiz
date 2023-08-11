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
    console.log(targetedUser);
    return quizzes.filter((quiz) => {
      const index = userQuizzesId.findIndex(
        (quizId) => quizId === quiz._id.toString()
      );
      return index >= 0;
    });
  }

  return (
    <Fragment>
      <h1 className='heading-1 w-fit mx-auto'>
        {user && user._id === targetedUser?._id ? 'ME' : targetedUser?.username}
      </h1>
      {targetedUser && (
        <Fragment>
          <h2 className='heading-2 w-fit mx-auto mt-4'>quizzes</h2>
          {user && user._id === targetedUser._id && (
            <button className='btn btn_green mx-auto mt-4'>
              <Link to={'/add-quiz'}>+ New Quiz</Link>
            </button>
          )}
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-6'>
            <table className='w-full text-xl text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase dark:text-gray-400'>
                <tr>
                  <th className='px-6 py-3 bg-gray-50 dark:bg-gray-800'>
                    Title
                  </th>
                  <th className='px-6 py-3'></th>
                  <th className='px-6 py-3 bg-gray-50 dark:bg-gray-800'>
                    #Questions
                  </th>
                  <th className='px-6 py-3 '>Description</th>
                  <th className='px-6 py-3 bg-gray-50 dark:bg-gray-800'>
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterQuizzes(targetedUser.quizzes).map(
                  ({ _id, title, numQuestions, owner }) => (
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
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Iste quod nesciunt cupiditate quibusdam sed
                        numquam dignissimos, optio maxime accusantium?
                      </td>
                      <td className='px-6 py-4 bg-gray-50 dark:bg-gray-800'>
                        <Link
                          to={`/user-profile/${owner._id}`}
                          className='cursor-pointer hover:text-blue-900'
                        >
                          <button className='btn'>{owner.username}</button>
                        </Link>
                      </td>
                      {user && user._id === targetedUser._id && (
                        <td className='px-6 py-4 dark:bg-gray-800 flex flex-col gap-4'>
                          <button className='btn btn_blue mx-auto'>
                            <Link to={`/edit-quiz/${_id}`}>Edit</Link>
                          </button>
                          <button
                            onClick={() => onDelete(_id)}
                            className='btn btn_red mx-auto'
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
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserProfile;
