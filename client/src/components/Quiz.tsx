import React from 'react';
import { useParams } from 'react-router-dom';

function Quiz() {
  const { id } = useParams();
  return <h2 className='my-3'>{`Quiz ID: ${id}`}</h2>;
}

export default Quiz;
