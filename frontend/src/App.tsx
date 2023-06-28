import { useState, Fragment } from 'react';
import './App.css';
import Wrapper from './components/Wrapper';
import { HomePage, QuizzesPage } from './pages';
import NavBar from './components/NavBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound';
import QuizRead from './pages/QuizRead';
import QuizAddForm from './pages/QuizAddForm';

function App() {
  return (
    <Fragment>
      <NavBar />
      <Wrapper>
        <Routes>
          <Route path='/quiz/:id' element={<QuizRead />} />
          <Route path='/quizzes' element={<QuizzesPage />} />
          <Route path='/add-quiz' element={<QuizAddForm />} />
          <Route path='/not-found' element={<NotFound />} />
          <Route path='/' element={<HomePage />} />
          <Route path='*' element={<Navigate replace to='/not-found' />} />
        </Routes>
      </Wrapper>
    </Fragment>
  );
}

export default App;
