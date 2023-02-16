import Joi from "joi";

export const exerciseSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.any().required(),
    type: Joi.string().valid("yoga", "meditation").required(),
    description: Joi.string(),
    duration: Joi.string().required(),
    level: Joi.string().valid("beginner", "very easy", "challanging", "advanced", "very challenging").required(),
    //ggf hier noch wenn type yoga dann nur die sonst andere
    category: Joi.array().required()

});

export const userSchema = Joi.object({
    firstname: Joi.string().min(2).required(),
    lastname: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    favorites: Joi.array()
});