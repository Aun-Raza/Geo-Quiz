/* eslint-disable linebreak-style */
interface QuizPropsTemplate {
  _id: number;
  title: string;
  owner: { username: string };
}

export interface QuizProps extends QuizPropsTemplate {
  numQuestions: number;
}

export interface QuizFormProps extends QuizPropsTemplate {
  questions: (MultipleChoiceProps | TrueFalseProps)[];
}

export type TrueFalseProps = {
  name: string;
  correctAnswer: boolean;
  type: 'True-False';
};

export type MultipleChoiceProps = {
  name: string;
  answers: string[];
  correctAnswer: string;
  type: 'Multiple-Choice';
};
