const InvariantError = require("../../exceptions/InvariantError");
const UploadsSchema = require("./schema")

const UploadsValidator = {
    validateUploadsHeader : (payload) =>{
        const valRes = UploadsSchema.validate(payload);

        if (valRes.error) {
            throw new InvariantError(valRes.error.message);
        }
    }
}
module.exports = UploadsValidator;