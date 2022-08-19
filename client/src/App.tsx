import React, { Fragment, useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import QuizService from './services/quizzes';
import QuizTable from './components/QuizTable';
import LoginForm from './components/LoginForm';
import NotFound from './components/NotFound';
import UserService from './services/users';
import jwtDecode from 'jwt-decode';
import { ILoginProps, IUser } from './interfaces/IUser';
import { IQuiz } from './interfaces/IQuiz';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Quiz from './components/Quiz';

function App() {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [user, setUser] = useState<IUser>();
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

    const user: IUser = jwtDecode(token);
    setUser(user);
  }

  async function loginUser(body: ILoginProps) {
    try {
      const { headers } = await UserService.loginUser(body);

      localStorage.setItem('token', headers['x-auth-token']);
      populateUser();
      navigate('/quizzes');
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <Fragment>
      <NavBar user={user} setUser={setUser} />
      <div className='container'>
        <Routes>
          <Route path='/quiz/:id' element={<Quiz />} />
          <Route path='/quizzes' element={<QuizTable quizzes={quizzes} />} />
          <Route path='/login' element={<LoginForm loginUser={loginUser} />} />
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Fragment>
  );
}

export default App;
