import { Fragment, useEffect, useState } from 'react';
import {
  IForm,
  IQuestion,
  MultipleChoiceProps,
  QuizAddProps,
  TrueFalseProps,
} from '../types';
import { UserProps } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import QuizService from '../services/service.quiz';
import { v4 as uuid } from 'uuid';
import validator from '../validation';

const QuizForm = ({
  user,
  formType,
  onCreateQuiz,
  onUpdateQuiz,
}: {
  user: UserProps | undefined;
  formType: IForm;
  onCreateQuiz: (quiz: QuizAddProps) => void;
  onUpdateQuiz: (id: string, quiz: QuizAddProps) => void;
}) => {
  const [quiz, setQuiz] = useState<QuizAddProps>({
    title: '',
    description: '',
    questions: [],
  });

  type ErrorType = {
    [key: string | number]: string;
  };

  const [errors, setErrors] = useState<ErrorType>({});

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    initQuiz();
  }, []);

  async function initQuiz() {
    if (!user) {
      return navigate('/login');
    }

    if (formType === IForm.Add) return;
    else if (formType === IForm.Edit) {
      const { data } = await QuizService.getQuiz(id);
      data.questions.forEach((question) => {
        const reactId = uuid();
        question['reactId'] = reactId;
        if (question.type === 'Multiple-Choice') {
          const correctAnswerIndex = question.answers.findIndex(
            (answer) => answer === question.correctAnswer
          );
          question['correctAnswerIndex'] = correctAnswerIndex;
        }
      });
      setQuiz(data);
    }
  }

  function deepCloneQuiz() {
    return {
      ...quiz,
      questions: quiz.questions.map((question) => {
        return { ...question };
      }),
    };
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // deep clone for purpose of http
    const quizClone = deepCloneQuiz();
    const { questions } = quizClone;

    // set correctAnswer relative to index positioning to answers
    questions.forEach((question) => {
      if (question.type === 'Multiple-Choice') {
        question.correctAnswer = question.answers[question.correctAnswerIndex!];
      }
    });

    // for http capability, remove unneeded properties
    delete quizClone['_id'];
    delete quizClone['owner'];
    questions.forEach((question) => {
      delete question['reactId'];
      delete question['_id'];
      if (question.type === 'Multiple-Choice') {
        delete question['correctAnswerIndex'];
      }
    });

    const result = validator.validate(quizClone, { abortEarly: false });

    if (result['error']) {
      const { message } = result.error;
      const errorMessages = message.replace(/"/g, '').split('.');
      const errors: ErrorType = {};

      errorMessages.forEach((errorMsg) => {
        if (errorMsg.includes('title')) {
          errors['title'] = errorMsg;
        } else if (errorMsg.includes('description')) {
          errors['description'] = errorMsg;
        } else {
          const match = errorMsg.match(/\d+/) as RegExpMatchArray;
          const index = parseInt(match[0]);
          errors[index] = errorMsg;
        }
      });

      setErrors(errors);
    } else {
      try {
        console.log(quizClone);
        if (formType === IForm.Add) {
          await onCreateQuiz(quizClone);
        } else if (formType === IForm.Edit) {
          await onUpdateQuiz(id || '', quizClone);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleQuizTitle(title: string) {
    const quizClone = deepCloneQuiz();
    quizClone.title = title;
    setQuiz(quizClone);
  }

  function handleQuizDescription(desc: string) {
    const quizClone = deepCloneQuiz();
    quizClone.description = desc;
    setQuiz(quizClone);
  }

  function handleQuestionName(name: string, key: string) {
    const quizClone = deepCloneQuiz();
    const question = quizClone.questions.find(
      (question) => question.reactId === key
    );
    if (!question) return;

    question.name = name;
    setQuiz(quizClone);
  }

  function handleCorrectAnswer(key: string, value: string) {
    const quizClone = deepCloneQuiz();
    const question = quizClone.questions.find(
      (question) => question.reactId === key
    );

    if (!question) return;
    const { type } = question;

    if (type === 'True-False') {
      const boolValue = value === 'True'; // Convert input value "String" to boolean
      question.correctAnswer = boolValue;
    } else if (type === 'Multiple-Choice') {
      const index = Number(value); // Convert input value "String" to integer
      (question as MultipleChoiceProps).correctAnswerIndex = index;
    }
    setQuiz(quizClone);
  }

  function checkCorrectIndex(key: string, index: number) {
    const question = quiz.questions.find(
      (question) => question.reactId === key
    );
    if (!question) return false;

    return (question as MultipleChoiceProps).correctAnswerIndex === index;
  }

  function handleMultipleChoiceAnswer(
    key: string,
    index: number,
    value: string
  ) {
    const quizClone = deepCloneQuiz();
    const question = quizClone.questions.find(
      (question) => question.reactId === key
    );

    if (!question) return;
    (question as MultipleChoiceProps).answers[index] = value;
    setQuiz(quizClone);
  }

  function addQuestion(type: IQuestion) {
    const quizClone = deepCloneQuiz();
    const { questions } = quizClone;

    const newId = uuid();
    type === IQuestion.TrueFalse
      ? questions.push({
          reactId: newId,
          name: '',
          correctAnswer: true,
          type: 'True-False',
        })
      : questions.push({
          reactId: newId,
          name: '',
          answers: ['', ''],
          correctAnswer: '',
          correctAnswerIndex: 0,
          type: 'Multiple-Choice',
        });

    setErrors({});
    setQuiz(quizClone);
  }

  function editMCAnswersBlock(key: string, type: string) {
    const quizClone = deepCloneQuiz();
    const question = quizClone.questions.find(
      (question) => question.reactId === key
    ) as MultipleChoiceProps;

    if (!question) return;

    const { answers } = question;
    if (type === 'add') {
      answers.push('');
    } else if (type === 'remove') {
      if (answers.length <= 2) return;

      answers.pop();

      // Shift correctAnswerIndex if correctAnswerIndex is out of bounds
      if (question.correctAnswerIndex! >= answers.length) {
        question.correctAnswerIndex = answers.length - 1;
      }
    }
    setQuiz(quizClone);
  }

  function renderTrueFalseInput(
    question: TrueFalseProps,
    key: string,
    index: number
  ) {
    return (
      <Fragment>
        <h2 className='text-4xl font-mono mt-2'>Question {index + 1}</h2>
        {/* Render Name Change */}
        <div className='mt-4'>
          <label className='input-label' htmlFor={`question${key}_title`}>
            Name
          </label>
          <input
            type='text'
            id={`question${key}_title`}
            className='input-text'
            value={question.name}
            onChange={(e) => handleQuestionName(e.target.value, key)}
          />
        </div>
        {/* Correct Answer */}
        <h2 className='text-3xl font-mono mt-2'>Correct Answer</h2>
        <div className='flex gap-4 mb-4 mt-2'>
          {['True', 'False'].map((answer, index) => {
            return (
              <div
                className='flex items-center gap-2'
                key={`${index}${answer}`}
              >
                <input
                  type='radio'
                  name={`question${key}_correctAnswer`}
                  id={`question${key}_correctAnswer${answer}`}
                  className='input-radio'
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
    key: string,
    index: number
  ) {
    return (
      <Fragment>
        <h2 className='text-4xl font-mono mt-2'>Question {index + 1}</h2>
        {/* Render Name Change */}
        <div className='mt-4'>
          <label className='input-label' htmlFor={`question${key}_title`}>
            Name
          </label>
          <input
            type='text'
            id={`question${key}_title`}
            className='input-text'
            value={question.name}
            onChange={(e) => handleQuestionName(e.target.value, key)}
          />
        </div>
        <h2 className='text-3xl font-mono mt-4'>Answers</h2>
        {/* Answers */}
        <div className='pt-2 flex flex-col gap-2'>
          {question.answers.map((answer, number) => {
            return (
              <div key={`_id_question${key}_answer${number}`}>
                <label
                  className='input-label text-sm font-mono'
                  htmlFor={`question${key}_answer${number}`}
                >
                  Answer {number + 1}
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
              onClick={() => editMCAnswersBlock(key, 'add')}
              value='  +  '
              className='btn btn_green'
            />
            <input
              type='button'
              onClick={() => editMCAnswersBlock(key, 'remove')}
              value='  -  '
              className='btn btn_red'
            />
          </div>
        </div>
        <h2 className='text-3xl font-mono mt-4'>Correct Answer</h2>
        {/* Correct Answer */}
        <div className='flex gap-3'>
          {question.answers.map((_, index) => {
            return (
              <div
                className='flex items-center gap-2 ps-1 mt-2 mb-4'
                key={`_id_question${key}_correctAnswer${index}`}
              >
                <input
                  type='radio'
                  name={`question${key}_correctAnswer`}
                  id={`question${key}_correctAnswer${index}`}
                  className='input-radio'
                  value={index}
                  checked={checkCorrectIndex(key, index)}
                  onChange={(e) => handleCorrectAnswer(key, e.target.value)}
                />
                <label htmlFor={`question${key}_correctAnswer${index}`}>
                  {index + 1}
                </label>
              </div>
            );
          })}
        </div>
      </Fragment>
    );
  }

  function deleteQuestion(id: string) {
    const quizClone = deepCloneQuiz();
    quizClone.questions = quizClone.questions.filter(
      (question) => question.reactId !== id
    );
    setErrors({});
    setQuiz(quizClone);
  }

  return (
    <div className='container w-2/3 mx-auto'>
      <h1 className='heading-1'>
        {formType === IForm.Add ? 'Add' : 'Edit'} Quiz
      </h1>
      <form onSubmit={(e) => handleFormSubmit(e)} className='mt-4 p-4'>
        <div>
          <label className='input-label' htmlFor='title'>
            Title
          </label>
          <input
            type='text'
            value={quiz.title}
            onChange={(e) => handleQuizTitle(e.target.value)}
            className='input-text'
          />
          {errors['title'] && (
            <div className='text-sm mt-1 text-red-500'>{errors['title']}</div>
          )}
        </div>
        <div>
          <label className='input-label mt-4' htmlFor='description'>
            Description
          </label>
          <textarea
            className='input-text'
            rows={3}
            value={quiz.description}
            onChange={(e) => handleQuizDescription(e.target.value)}
          />
          {errors['description'] && (
            <div className='text-sm mt-1 text-red-500'>
              {errors['description']}
            </div>
          )}
        </div>
        {/* Inputs */}
        {quiz.questions.map((question, index) => {
          return (
            <div
              key={question.reactId}
              className='border rounded-lg ps-4 pe-3 relative my-6 bg-slate-100'
            >
              <div
                className='absolute top-1 right-2'
                onClick={() => deleteQuestion(question.reactId!)}
              >
                <button className='btn  flex items-center'>
                  <img className='w-6 h-6' src='/assets/remove_icon.svg' />
                  Remove
                </button>
              </div>
              {question.type === 'True-False'
                ? renderTrueFalseInput(question, question.reactId!, index)
                : renderMultipleChoiceInput(question, question.reactId!, index)}
              {errors[index] && (
                <div className='text-sm mb-2 text-red-500'>
                  Please fill all the empty fields
                </div>
              )}
            </div>
          );
        })}
        {/* Buttons */}
        <div className='flex gap-2 mt-4'>
          <button
            type='button'
            onClick={() => addQuestion(IQuestion.TrueFalse)}
            className='btn btn_green'
          >
            + True False
          </button>
          <button
            type='button'
            onClick={() => addQuestion(IQuestion.MultipleChoice)}
            className='btn btn_purple'
          >
            + Multiple Choice
          </button>
        </div>
        <button type='submit' className='btn btn_blue mt-4 mx-auto'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
