const Joi = require("joi");

const playlistSchema = Joi.object({
    name : Joi.string().required()
})

module.exports = playlistSchema;
