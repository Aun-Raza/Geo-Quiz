import React, { Fragment, useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import QuizTable from './components/QuizTable';
import QuizService from './services/quizzes';
import UserService from './services/users';
import { Quiz } from './interfaces/Quiz';
import LoginForm from './components/LoginForm';
import { loginProps, User } from './interfaces/User';
import jwtDecode from 'jwt-decode';
import './App.css';

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    populateQuizzes();
    populateUser();
  }, []);

  async function populateQuizzes() {
    const { data: quizzes } = await QuizService.getQuizzes();
    setQuizzes(quizzes);
  }

  function populateUser() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const user: User = jwtDecode(token);
    setUser(user);
  }

  async function loginUser(body: loginProps) {
    const { headers } = await UserService.loginUser(body);

    localStorage.setItem('token', headers['x-auth-token']);
    populateUser();
  }

  return (
    <Fragment>
      <NavBar user={user} />
      <div className='container'>
        <QuizTable quizzes={quizzes} />
        <LoginForm loginUser={loginUser} />
      </div>
    </Fragment>
  );
}

export default App;
