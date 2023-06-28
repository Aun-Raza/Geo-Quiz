import { Fragment, useState } from 'react';
import { MultipleChoiceProps, QuizAddProps, TrueFalseProps } from '../types';

const QuizAddForm = () => {
  const [quiz, setQuiz] = useState<QuizAddProps>({
    title: '',
    owner: { username: '' },
    questions: [],
  });

  enum QuestionType {
    TF,
    MC,
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const quizClone = { ...quiz };
    quizClone.questions.forEach((question) => {
      if (question.type === 'Multiple-Choice') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        question.correctAnswer = question.answers[question.correctAnswerIndex!];
      }
    });

    console.log(quiz);
  }

  function handleQuizTitle(title: string) {
    const quizClone = { ...quiz };
    quizClone.title = title;
    setQuiz(quizClone);
  }

  function handleQuestionName(name: string, key: number) {
    const quizClone = { ...quiz };
    quizClone.questions[key].name = name;
    setQuiz(quizClone);
  }

  function handleCorrectAnswer(key: number, value: string) {
    const quizClone = { ...quiz };
    const type = quizClone.questions[key].type;

    if (type === 'True-False') {
      const valueBool = value === 'True';
      quizClone.questions[key].correctAnswer = valueBool;
      setQuiz(quizClone);
    } else if (type === 'Multiple-Choice') {
      const index = Number(value);
      (quizClone.questions[key] as MultipleChoiceProps).correctAnswerIndex =
        index;
      setQuiz(quizClone);
    }
  }

  function checkCorrectIndex(key: number, index: number) {
    return (
      (quiz.questions[key] as MultipleChoiceProps).correctAnswerIndex === index
    );
  }

  function handleMultipleChoiceAnswer(
    key: number,
    index: number,
    value: string
  ) {
    const quizClone = { ...quiz };
    (quizClone.questions[key] as MultipleChoiceProps).answers[index] = value;
    setQuiz(quizClone);
  }

  function addQuestion(type: QuestionType) {
    const quizClone = { ...quiz };
    const id = quizClone.questions.length
      ? quizClone.questions[quizClone.questions.length - 1].react_id! + 1
      : 0;
    type === QuestionType.TF
      ? quizClone.questions.push({
          react_id: id,
          name: '',
          correctAnswer: true,
          type: 'True-False',
        })
      : quizClone.questions.push({
          react_id: id,
          name: '',
          answers: ['', '', '', ''],
          correctAnswer: '',
          correctAnswerIndex: 0,
          type: 'Multiple-Choice',
        });

    setQuiz(quizClone);
  }

  function addMultipleChoiceAnswer(key: number) {
    const quizClone = { ...quiz };
    (quizClone.questions[key] as MultipleChoiceProps).answers.push('');
    setQuiz(quizClone);
  }

  function removeMultipleChoiceAnswer(key: number) {
    const quizClone = { ...quiz };
    if ((quizClone.questions[key] as MultipleChoiceProps).answers.length <= 2)
      return;
    (quizClone.questions[key] as MultipleChoiceProps).answers.pop();

    if (
      (quizClone.questions[key] as MultipleChoiceProps).correctAnswerIndex! >=
      (quizClone.questions[key] as MultipleChoiceProps).answers.length
    ) {
      (quizClone.questions[key] as MultipleChoiceProps).correctAnswerIndex =
        (quizClone.questions[key] as MultipleChoiceProps).answers.length - 1;
    }
    setQuiz(quizClone);
  }

  function renderTrueFalseInput(question: TrueFalseProps, key: number) {
    return (
      <Fragment>
        <h2 className='text-center'>True and False Question</h2>
        {/* Render Name Change */}
        <div className='flex mt-4 gap-2'>
          <label htmlFor={`question${key}_title`}>Name</label>
          <input
            type='text'
            id={`question${key}_title`}
            className='input-text'
            value={question.name}
            onChange={(e) => handleQuestionName(e.target.value, key)}
          />
        </div>
        {/* Correct Answer */}
        <h2 className='mt-2 text-center'>Correct Answer</h2>
        <div className='flex justify-center gap-4'>
          {['True', 'False'].map((answer, index) => {
            return (
              <div className='flex gap-2' key={`${index}${answer}`}>
                <input
                  type='radio'
                  name={`question${key}_correctAnswer`}
                  id={`question${key}_correctAnswer${answer}`}
                  className='input-text'
                  value={answer}
                  checked={
                    question.correctAnswer.toString() === answer.toLowerCase()
                  }
                  onChange={(e) => handleCorrectAnswer(key, e.target.value)}
                />
                <label htmlFor={`question${key}_correctAnswer${answer}`}>
                  {answer}
                </label>
              </div>
            );
          })}
        </div>
      </Fragment>
    );
  }

  function renderMultipleChoiceInput(
    question: MultipleChoiceProps,
    key: number
  ) {
    return (
      <Fragment>
        <h2 className='text-center'>Multiple Choice Question</h2>
        {/* Render Name Change */}
        <div className='flex mt-4 gap-2'>
          <label htmlFor={`question${key}_title`}>Name</label>
          <input
            type='text'
            id={`question${key}_title`}
            className='input-text'
            value={question.name}
            onChange={(e) => handleQuestionName(e.target.value, key)}
          />
        </div>
        <h2 className='mt-2'>Answers</h2>
        {/* Answers */}
        <div className='ps-4 pt-2 flex flex-col gap-2'>
          {question.answers.map((answer, number) => {
            return (
              <div
                className='flex gap-2'
                key={`_id_question${key}_answer${number}`}
              >
                <label htmlFor={`question${key}_answer${number}`}>
                  Answer #{number}
                </label>
                <input
                  type='text'
                  id={`question${key}_answer${number}`}
                  className='input-text'
                  value={answer}
                  onChange={(e) =>
                    handleMultipleChoiceAnswer(key, number, e.target.value)
                  }
                />
              </div>
            );
          })}
          <div className='flex gap-2'>
            <input
              type='button'
              onClick={() => addMultipleChoiceAnswer(key)}
              value='Add'
              className='btn'
            />
            <input
              type='button'
              onClick={() => removeMultipleChoiceAnswer(key)}
              value='Remove'
              className='btn'
            />
          </div>
        </div>
        <h2 className='mt-2 text-center'>Correct Answer</h2>
        {/* Correct Answer */}
        <div className='flex gap-3 justify-center'>
          {question.answers.map((_, index) => {
            return (
              <div
                className='flex gap-2 ps-1'
                key={`_id_question${key}_correctAnswer${index}`}
              >
                <input
                  type='radio'
                  name={`question${key}_correctAnswer`}
                  id={`question${key}_correctAnswer${index}`}
                  className='input-text'
                  value={index}
                  checked={checkCorrectIndex(key, index)}
                  onChange={(e) => handleCorrectAnswer(key, e.target.value)}
                />
                <label htmlFor={`question${key}_correctAnswer${index}`}>
                  {index}
                </label>
              </div>
            );
          })}
        </div>
      </Fragment>
    );
  }

  function deleteQuestion(id: number) {
    const quizClone = { ...quiz };

    quizClone.questions = quizClone.questions.filter(
      (question) => question.react_id !== id
    );
    setQuiz(quizClone);
  }

  return (
    <Fragment>
      <h1 className='text-4xl w-fit mx-auto'>Add New Quiz</h1>
      <form onSubmit={(e) => handleFormSubmit(e)} className='mt-4 p-4'>
        <div className='flex gap-2'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            value={quiz.title}
            onChange={(e) => handleQuizTitle(e.target.value)}
            className='input-text'
          />
        </div>
        {/* Inputs */}
        {quiz.questions.map((question) => {
          return (
            <div key={question.react_id} className='border rounded-lg p-5 my-2'>
              <div className='flex justify-end  font-semibold text-2xl'>
                <span
                  onClick={() => deleteQuestion(question.react_id!)}
                  className='cursor-pointer text-red-500'
                >
                  X
                </span>
              </div>
              {question.type === 'True-False'
                ? renderTrueFalseInput(question, question.react_id!)
                : renderMultipleChoiceInput(question, question.react_id!)}
            </div>
          );
        })}
        {/* Buttons */}
        <div className='flex gap-2 mt-4'>
          <button
            type='button'
            onClick={() => addQuestion(QuestionType.TF)}
            className='btn'
          >
            Add True False
          </button>
          <button
            type='button'
            onClick={() => addQuestion(QuestionType.MC)}
            className='btn'
          >
            Add Multiple Choice
          </button>
        </div>
        <button className='btn mt-4 mx-auto'>Submit</button>
      </form>
    </Fragment>
  );
};

export default QuizAddForm;
