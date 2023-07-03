import { useState, useEffect } from 'react';
import { LoginFormProps, LoginProps } from '../types';
import { useNavigate } from 'react-router-dom';

const Login = ({ loginUser }: LoginFormProps) => {
  const [formUser, setFormUser] = useState<LoginProps>({
    username: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) return navigate('/quizzes');
  }, []);

  interface AxiosError {
    response: {
      data: { error: string };
    };
  }

  function handleUserChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormUser((prevFormUser) => ({
      ...prevFormUser,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');
    try {
      await loginUser(formUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as unknown as AxiosError;
        setErrorMsg(axiosError.response.data.error);
      }
    }
  }

  return (
    <div>
      <h1 className='text-4xl w-fit mx-auto'>Login</h1>
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className='bg-white mt-4 shadow-md border rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='username'
          >
            Username
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='username'
            type='text'
            name='username'
            placeholder='Username'
            value={formUser.username}
            onChange={(e) => handleUserChange(e)}
          />
        </div>
        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            id='password'
            type='password'
            name='password'
            placeholder='******************'
            value={formUser.password}
            onChange={(e) => handleUserChange(e)}
          />
          <p className='text-red-500 text-xs italic'>
            Please choose a password.
          </p>
        </div>
        {errorMsg && <div className='border p-3 m-3'>{errorMsg}</div>}
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
