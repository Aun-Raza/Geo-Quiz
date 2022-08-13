import mongoose, { ObjectId } from 'mongoose';
import { QuizModel } from '../../model/quiz/model.quiz';
import { User } from '../user/User';

type typeTrueFalse = {
    name: string;
    type: string;
    correctAnswer: true;
};

type typeMultipleChoice = {
    name: string;
    type: string;
    answers: string[];
    correctAnswer: string;
};

const TrueFalse: typeTrueFalse = {
  name: 'true and false question',
  type: 'True-False',
  correctAnswer: true,
};
const MultipleChoice: typeMultipleChoice = {
  name: 'multiple choice question',
  type: 'Multiple-Choice',
  answers: ['a', 'b', 'c', 'd'],
  correctAnswer: 'a',
};

interface IQuiz {
    _id: ObjectId;
    owner: mongoose.Types.ObjectId;
}

class Quiz {
  public title = 'quiz1';
  public static trueFalse = TrueFalse;
  public static multipleChoice = MultipleChoice;

  public static async saveQuiz() {
    const user = await User.saveUser();

    const quiz = new QuizModel(
      Object.assign(new Quiz(), { owner: user._id })
    );
    await quiz.save();
    return quiz;
  }

  constructor(
        public questions: (typeTrueFalse | typeMultipleChoice)[] = [
          Quiz.trueFalse,
          Quiz.multipleChoice,
        ]
  ) {}

  public toString() {
    return {
      title: this.title,
      questions: this.questions,
    };
  }
}

export { Quiz, IQuiz };
