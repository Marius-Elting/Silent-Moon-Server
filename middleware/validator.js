import Joi from "joi";

export const exerciseSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.any().required(),
    type: Joi.string().valid("yoga", "meditation").required(),
    description: Joi.string(),
    duration: Joi.string().required(),
    level: Joi.string().valid("beginner", "very easy", "challanging", "advanced", "very challenging", "expert").required(),
    //ggf hier noch wenn type yoga dann nur die sonst andere
    category: Joi.array().required(),

});

export const userSchema = Joi.object({
    firstname: Joi.string().min(2).required().error(err => { err[0].message = "Firstname is to short"; return err; }),
    lastname: Joi.string().min(2).required().error(err => { err[0].message = "Lastname is to short"; return err; }),
    email: Joi.string().email().required().error(err => { err[0].message = "Email is not valid"; return err; }),
    password: Joi.string().min(8).required(),
    favorites: Joi.array(),
    remindtime: Joi.array(),
});