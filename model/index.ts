// @ts-nocheck
import { Schema, model } from 'mongoose';
import {
	AbstractQuestionSchema,
	TrueAndFalseSchema,
	MultipleChoiceSchema,
} from './sub-schemas';

interface Quiz {
	title: string;
	questions: [typeof AbstractQuestionSchema];
}

const QuizSchema = new Schema<Quiz>(
	{
		title: { type: String, minlength: 5, maxlength: 25, required: true },
		questions: {
			type: [AbstractQuestionSchema],
			default: undefined,
			required: true,
		},
	},
	{ timestamps: true }
);

/* 
	This Schema.property.discriminator method tricks mongoose into
	supporting multiple data types for the QuizSchema.questions field. 
*/

QuizSchema.path('questions').discriminator('True-False', TrueAndFalseSchema);
QuizSchema.path('questions').discriminator(
	'Multiple-Choice',
	MultipleChoiceSchema
);

const QuizModel = model('Quiz', QuizSchema);
export { QuizModel };
