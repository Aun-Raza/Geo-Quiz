import React, { Fragment, useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import QuizTable from './components/QuizTable';
import QuizService from './services/quizzes';
import UserService from './services/users';
import { Quiz } from './interfaces/Quiz';
import LoginForm from './components/LoginForm';
import { loginProps } from './interfaces/User';
import './App.css';

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    getQuizzes();
  }, []);

  async function getQuizzes() {
    const { data: quizzes } = await QuizService.getQuizzes();
    setQuizzes(quizzes);
  }

  async function loginUser({ username, password }: loginProps) {
    const { data: user, headers } = await UserService.loginUser({
      username,
      password,
    });
    localStorage.setItem('token', headers['x-auth-token']);
    console.log(user);
  }

  return (
    <Fragment>
      <NavBar />
      <div className='container'>
        <h2 className='my-3'>Quiz Table</h2>
        <QuizTable quizzes={quizzes} />
        <h2 className='my-3'>Login Form</h2>
        <LoginForm doLogin={loginUser} />
      </div>
    </Fragment>
  );
}

export default App;
