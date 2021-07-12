const InvariantError = require("../../exceptions/InvariantError");
const ExportsSchema = require("./schema")

const ExportValidator = {
    validateExportPayload : (payload)=>{
        const valRes = ExportsSchema.validate(payload);

        if (valRes.error) {
            throw new InvariantError(valRes.error.message);
        }
    }
}
module.exports = ExportValidator;