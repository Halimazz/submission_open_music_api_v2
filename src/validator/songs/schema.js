const Joi = require("joi");

const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .required(),
  performer: Joi.string().required(),
  genre: Joi.string().optional(),
  duration: Joi.number().integer().min(1).optional(),
  albumId: Joi.string().optional(),
}).required();

module.exports = { songPayloadSchema };
