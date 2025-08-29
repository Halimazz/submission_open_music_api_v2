import Joi from "joi";
const albumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
}).required();

export { albumPayloadSchema };