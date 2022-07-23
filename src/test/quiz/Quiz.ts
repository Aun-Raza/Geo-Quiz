import { ObjectId } from "mongoose";
import { QuizModel } from "../../model/quiz/model.quiz";

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
    name: "true and false question",
    type: "True-False",
    correctAnswer: true,
};
const MultipleChoice: typeMultipleChoice = {
    name: "multiple choice question",
    type: "Multiple-Choice",
    answers: ["a", "b", "c", "d"],
    correctAnswer: "a",
};

interface IQuiz {
    _id: ObjectId;
}

class Quiz {
    public title: string = "quiz1";
    public static trueFalse = TrueFalse;
    public static multipleChoice = MultipleChoice;

    public static async saveQuiz() {
        const doc = new QuizModel(new Quiz());
        await doc.save();
        return doc;
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
