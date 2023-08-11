/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  AbstractQuestionSchema,
  TrueAndFalseSchema,
  MultipleChoiceSchema,
} from './schemas';
import { isUser } from './validators/custom-validator.quiz';
import mongoose, { Schema, model, ObjectId } from 'mongoose';

interface IQuiz {
  _id: ObjectId;
  title: string;
  questions: [typeof AbstractQuestionSchema];
  owner: mongoose.Types.ObjectId;
}

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, minlength: 1, required: true },
  questions: {
    type: [AbstractQuestionSchema],
    default: undefined,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: function (v: ObjectId) {
        return isUser(v);
      },
      message: 'Quiz must have a registered user',
    },
    required: true,
  },
});

QuizSchema.virtual('numQuestions').get(function () {
  return this.questions.length;
});

/* 
	This Schema.property.discriminator method tricks mongoose into
	supporting multiple data types for the QuizSchema.questions field. 
*/

QuizSchema.path('questions').discriminator('True-False', TrueAndFalseSchema);
QuizSchema.path('questions').discriminator(
  'Multiple-Choice',
  MultipleChoiceSchema
);

const QuizModel = model<IQuiz>('Quiz', QuizSchema);
export { QuizModel };
