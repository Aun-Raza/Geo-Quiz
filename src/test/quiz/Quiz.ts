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

export class Quiz {
    public title: string = "quiz1";
    public static trueFalse = TrueFalse;
    public static multipleChoice = MultipleChoice;

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
