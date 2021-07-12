const InvariantError = require("../../exceptions/InvariantError");
const PlaylistCollaborationSchema = require("./schema")

const PlaylistCollaborationValidator = {
    validatePlaylistCollaborationPayload : (payload) => {
        const res = PlaylistCollaborationSchema.validate(payload);

        if (res.error) {
            throw new InvariantError(res.error.message);
        }
    }
}

module.exports = PlaylistCollaborationValidator;