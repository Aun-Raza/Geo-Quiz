import Joi from 'joi';

const validator = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(5).required(),
});

export default validator;
