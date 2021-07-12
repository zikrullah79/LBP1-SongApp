const InvariantError = require("../../exceptions/InvariantError");
const { musicPayloadSchema } = require("./schema")

const MusicValidator = {
    validateMusicPayload: (payload) =>{
        const validationResult = musicPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}
module.exports = MusicValidator;