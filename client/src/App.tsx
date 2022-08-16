import React, { Fragment, useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import NotFound from './components/common/NotFound';
import QuizTable from './components/QuizTable';
import QuizService from './services/quizzes';
import UserService from './services/users';
import { Quiz } from './interfaces/Quiz';
import { loginProps, User } from './interfaces/User';
import jwtDecode from 'jwt-decode';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

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
    try {
      const { headers } = await UserService.loginUser(body);

      localStorage.setItem('token', headers['x-auth-token']);
      populateUser();
      navigate('/');
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <Fragment>
      <NavBar user={user} setUser={setUser} />
      <div className='container'>
        <Routes>
          <Route path='/' element={<QuizTable quizzes={quizzes} />} />
          <Route path='/login' element={<LoginForm loginUser={loginUser} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Fragment>
  );
}

export default App;
