const Joi = require("joi");
const { password } = require("pg/lib/defaults");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required()
})

module.exports = { UserPayloadSchema }
