import mongoose, { Schema } from 'mongoose';

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
	answers: { type: [String], default: undefined, required: true },
	correctAnswer: {
		type: String,
		required: true,
		enum: ['a', 'b', 'c'],
		// function () {
		// 	console.log('this', this);
		// 	return this.answers.map((answer: string) => answer);
		// },
	},
});

export { AbstractQuestionSchema, TrueAndFalseSchema, MultipleChoiceSchema };
