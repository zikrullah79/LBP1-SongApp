const Joi = require("joi");

const PlaylistCollaborationSchema = Joi.object({
    userId : Joi.string().required(),
    playlistId : Joi.string().required()
})

module.exports = PlaylistCollaborationSchema;