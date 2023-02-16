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