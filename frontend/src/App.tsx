import { useState, Fragment, useEffect } from 'react';
import './App.css';
import Wrapper from './components/Wrapper';
import { HomePage, QuizzesPage } from './pages';
import NavBar from './components/NavBar';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NotFound from './pages/NotFound';
import QuizRead from './pages/QuizRead';
import QuizForm from './pages/QuizForm';
import About from './pages/About';
import Login from './pages/Login';
import {
  UserProps,
  LoginProps,
  QuizTableProps,
  IForm,
  QuizAddProps,
} from './types';
import jwtDecode from 'jwt-decode';
import UserService from './services/service.user';
import UserProfile from './pages/UserProfile';
import QuizService from './services/service.quiz';

function App() {
  const [user, setUser] = useState<UserProps>();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizTableProps[]>([]);

  useEffect(() => {
    populateUser();
  }, []);

  function populateUser() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const user: UserProps = jwtDecode(token);
    setUser(user);
    navigate(`/user-profile/${user?._id}`);
  }

  async function loginUser(body: LoginProps) {
    const { headers } = await UserService.loginUser(body);

    localStorage.setItem('token', headers['x-auth-token']);
    populateUser();
  }

  useEffect(() => {
    populateQuizzes();
  }, []);

  async function populateQuizzes() {
    const { data: quizzes } = await QuizService.getQuizzes();
    setQuizzes(quizzes);
  }

  async function handleCreateQuiz(newQuiz: QuizAddProps) {
    const token = localStorage.getItem('token');
    await QuizService.createQuiz(newQuiz, token || '');
    const { data: newQuizzes } = await QuizService.getQuizzes();
    setQuizzes(newQuizzes);
    navigate(`/user-profile/${user?._id}`);
  }

  async function handleUpdateQuiz(id: string, newQuiz: QuizAddProps) {
    const token = localStorage.getItem('token');
    await QuizService.updateQuiz(id, newQuiz, token || '');
    const { data: newQuizzes } = await QuizService.getQuizzes();
    setQuizzes(newQuizzes);
    navigate(`/user-profile/${user?._id}`);
  }

  async function handleDeleteQuiz(id: number) {
    const token = localStorage.getItem('token');
    await QuizService.deleteQuiz(id, token || '');
    const quizzesClone = quizzes.filter((quiz) => quiz._id !== id);
    setQuizzes(quizzesClone);
  }

  return (
    <Fragment>
      <NavBar user={user} setUser={setUser} />
      <Wrapper>
        <Routes>
          <Route path='/quiz/:id' element={<QuizRead />} />
          <Route path='/quizzes' element={<QuizzesPage quizzes={quizzes} />} />
          <Route path='/about' element={<About />} />
          <Route
            path='/add-quiz'
            element={
              <QuizForm
                user={user}
                onCreateQuiz={handleCreateQuiz}
                onUpdateQuiz={handleUpdateQuiz}
                formType={IForm.Add}
              />
            }
          />
          <Route
            path='/edit-quiz/:id'
            element={
              <QuizForm
                user={user}
                onCreateQuiz={handleCreateQuiz}
                onUpdateQuiz={handleUpdateQuiz}
                formType={IForm.Edit}
              />
            }
          />
          <Route
            path='/user-profile/:id'
            element={
              <UserProfile
                onDelete={handleDeleteQuiz}
                user={user}
                quizzes={quizzes}
              />
            }
          />
          <Route path='/login' element={<Login loginUser={loginUser} />} />
          <Route path='/not-found' element={<NotFound />} />
          <Route path='/' element={<HomePage />} />
          <Route path='*' element={<Navigate replace to='/not-found' />} />
        </Routes>
      </Wrapper>
    </Fragment>
  );
}

export default App;
