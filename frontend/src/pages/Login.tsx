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
      <h1 className='heading-1'>Login</h1>
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className='bg-white mt-4 w-2/3 mx-auto shadow-md border rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='mt-2 mb-4 relative z-0 group'>
          <label
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            htmlFor='username'
          >
            Username
          </label>
          <input
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            id='username'
            type='text'
            name='username'
            placeholder='Username'
            value={formUser.username}
            onChange={(e) => handleUserChange(e)}
          />
        </div>
        <div className='mt-8 relative z-0 group'>
          <label
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            id='password'
            type='password'
            name='password'
            placeholder='Password'
            value={formUser.password}
            onChange={(e) => handleUserChange(e)}
          />
        </div>
        {errorMsg && (
          <div className='mt-1 mb-4 text-red-600 text-lg'>{errorMsg}</div>
        )}
        <div className='my-4 text-sm font-mono'>
          <h2 className='text-lg font-semibold'>Demo Account</h2>
          <p>Username: john_doe</p>
          <p>Password: 12345</p>
        </div>
        <button className='btn btn_blue mt-2'>Login</button>
      </form>
    </div>
  );
};

export default Login;
