import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QuizTableProps } from '../types/types.quiz';
import { useNavigate } from 'react-router-dom';

function Quiz({ quizzes }: QuizTableProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const quiz = quizzes.find((quiz) => quiz._id.toString() === id);

  useEffect(() => {
    if (!quiz) navigate('/not-found');
  }, []);

  return <pre className='my-3'>{JSON.stringify(quiz, null, 2)}</pre>;
}

export default Quiz;
