const Joi = require("joi");

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performmer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string()
})

module.exports = { SongsPayloadSchema }
