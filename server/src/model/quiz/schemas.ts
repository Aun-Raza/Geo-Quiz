/* eslint-disable linebreak-style */
import { isDuplicated, isIncluded } from './validators/schema-validator.quiz';
import { Schema } from 'mongoose';

interface AbstractQuestion {
  name: string;
  type: string;
}

interface TrueAndFalse {
  correctAnswer: boolean;
}

interface MultipleChoice {
  answers: [string];
  correctAnswer: string;
}

/* 
	Setting the discriminatorKey's value as the same name 'type' tricks 
	mongoose into making questionSchema abstract.
*/

const AbstractQuestionSchema = new Schema<AbstractQuestion>(
  {
    name: { type: String, minlength: 5, maxlength: 25, required: true },
    type: {
      type: String,
      enum: ['True-False', 'Multiple-Choice'],
      required: true,
    },
  },
  { discriminatorKey: 'type' }
);

const TrueAndFalseSchema = new Schema<TrueAndFalse>({
  correctAnswer: { type: Boolean, required: true },
});

const MultipleChoiceSchema = new Schema<MultipleChoice>({
  answers: {
    type: [String],
    default: undefined,
    validate: {
      validator: (value: string[]) => !isDuplicated(value),
      message: (answer: { value: string[] }) =>
        `${answer.value.join(' ')} cannot be duplicated`,
    },
    required: true,
  },
  correctAnswer: {
    type: String,
    validate: {
      validator: function (value: string) {
        return isIncluded(value, this.answers);
      },
      message: (answer: { value: string }) =>
        `${answer.value} is not a valid answer`,
    },
    required: true,
  },
});

export { AbstractQuestionSchema, TrueAndFalseSchema, MultipleChoiceSchema };
