export type QuizProps = {
  _id: number;
  title: string;
  questions: { name: string }[];
  owner: { username: string };
};

export type QuizTableProps = {
  quizzes: QuizProps[];
};
