const { UserPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

const UserValidators = {
    validatePayloads : (payload) =>{
        const validationResult = UserPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
} 

module.exports = UserValidators