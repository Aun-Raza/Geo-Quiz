// @ts-nocheck
import { Schema, model } from 'mongoose';
import {
	AbstractQuestionSchema,
	TrueAndFalseSchema,
	MultipleChoiceSchema,
} from './sub-schemas';
import Joi from 'joi';

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

const schema = Joi.object({
	title: Joi.string().min(5).max(25).required(),
	questions: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().min(5).max(25).required(),
				type: Joi.string().required(),
				answers: Joi.array().items(Joi.string()).required(),
				correctAnswer: Joi.string().required(),
			}),
			Joi.object({
				name: Joi.string().min(5).max(25).required(),
				type: Joi.string().required(),
				correctAnswer: Joi.boolean().required(),
			})
		)
		.min(1)
		.required(),
});

QuizSchema.path('questions').discriminator('True-False', TrueAndFalseSchema);
QuizSchema.path('questions').discriminator(
	'Multiple-Choice',
	MultipleChoiceSchema
);

const QuizModel = model('Quiz', QuizSchema);
export { QuizModel, schema };
