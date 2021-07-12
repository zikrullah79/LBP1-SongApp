const InvariantError = require("../../exceptions/InvariantError");
const playlistSchema = require("./schema");

const PlaylistValidator =  {
    validatePlaylistPayload : (payload) =>{
        const validationResult = playlistSchema.validate(payload)        

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}
module.exports = PlaylistValidator;