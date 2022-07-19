import Joi from "joi";

const validator = Joi.object({
    email: Joi.string().min(5).required(),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
});

export default validator;