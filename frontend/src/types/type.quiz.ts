interface QuizPropsAbstract {
  title: string;
  description: string;
  owner?: { username: string; _id: string };
}

export interface QuizTableProps extends QuizPropsAbstract {
  _id: number;
  numQuestions: number;
}

export type TrueFalseProps = {
  reactId?: string;
  _id?: string;
  name: string;
  correctAnswer: boolean;
  type: 'True-False';
};

export type MultipleChoiceProps = {
  reactId?: string;
  _id?: string;
  name: string;
  answers: string[];
  correctAnswer: string;
  correctAnswerIndex?: number;
  type: 'Multiple-Choice';
};

export interface QuizProps extends QuizPropsAbstract {
  _id: number;
  questions: (MultipleChoiceProps | TrueFalseProps)[];
}

export interface QuizAddProps extends QuizPropsAbstract {
  questions: (MultipleChoiceProps | TrueFalseProps)[];
}
