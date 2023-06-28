interface QuizPropsAbstract {
  title: string;
  owner: { username: string };
}

export interface QuizTableProps extends QuizPropsAbstract {
  _id: number;
  numQuestions: number;
}

export type TrueFalseProps = {
  react_id?: number;
  name: string;
  correctAnswer: boolean;
  type: 'True-False';
};

export type MultipleChoiceProps = {
  react_id?: number;
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
