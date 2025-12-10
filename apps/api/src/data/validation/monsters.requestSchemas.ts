import Joi from "joi";

const monster = {
    name: Joi.string().min(1).max(100).required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name cannot be empty.",
        "string.min": "Name must be at least 1 character long.",
        "string.max": "Name must not exceed 100 characters.",
        "any.required": "Name is required.",
    }),
    short_description: Joi.string().allow(null).optional().empty(null).messages({
        "string.base": "Short-Description must be a string",
    }),
    description: Joi.string().allow(null).optional().max(1000).empty("").messages({
        "string.base": "Description must be a string.",
        "string.max": "Description must not exceed 1000 characters.",
    })
}

export const createMonsterSchema = Joi.object(monster);