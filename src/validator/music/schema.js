
const joi = require("joi")
const musicPayloadSchema = joi.object({
    title : joi.string().required(),
    year : joi.number().required(),
    performer : joi.string().required(),
    genre : joi.string(),
    duration : joi.number()
})

module.exports = {musicPayloadSchema};