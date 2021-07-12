const Joi = require("joi");

const UserPayloadSchema = Joi.object({
    username : Joi.string().required(),
    fullname : Joi.string().required(),
    password : Joi.string().required()
});

module.exports = {UserPayloadSchema}