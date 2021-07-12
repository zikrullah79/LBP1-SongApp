const ClientError = require("./ClientError");

class NotFoundError extends ClientError{
    constructor(message,code=404){
        super(message,code);
        this._name = "NotFoundError";
    }
}
module.exports = NotFoundError;