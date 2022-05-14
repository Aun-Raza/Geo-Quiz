import Joi from 'joi';

const mCValidator = Joi.object({
	name: Joi.string().min(5).max(25).required(),
	type: Joi.string().required(),
	answers: Joi.array().items(Joi.string()).required(),
	correctAnswer: Joi.string().required(),
});

const tFValidator = Joi.object({
	name: Joi.string().min(5).max(25).required(),
	type: Joi.string().required(),
	correctAnswer: Joi.boolean().required(),
});

const validator = Joi.object({
	title: Joi.string().min(5).max(25).required(),
	questions: Joi.array().items(mCValidator, tFValidator).min(1).required(),
});

export default validator;
