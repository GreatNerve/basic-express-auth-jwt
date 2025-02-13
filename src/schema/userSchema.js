import Joi from "joi";

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;


export const userRegisterValidationSchema = Joi.object({
    fullName: Joi.string().min(3).max(255).required(),
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().pattern(passwordRegex).min(8).max(50).required(),
    date_of_birth: Joi.date().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    country: Joi.string().required().messages(),
});
