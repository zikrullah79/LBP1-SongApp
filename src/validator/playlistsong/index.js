const InvariantError = require("../../exceptions/InvariantError");
const PlaylistSongsSchema = require("./schema")


const PlaylistSongsValidator = {
    validatePlaylistSongsPayload : (payload) =>{
        const res = PlaylistSongsSchema.validate(payload);

        if (res.error) {
            throw new InvariantError(res.error.message)
        }
    }
}

module.exports = PlaylistSongsValidator;