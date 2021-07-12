const ClientError = require("../../exceptions/ClientError")

class AuthHandler {
    constructor(authService,userService,tokenManager,validator){
        this._authService = authService;
        this._userService = userService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request,h) {
        try {
            this._validator.validatePostAuthenticationPayload(request.payload); 
            const {username,password} = request.payload;

            const id = await this._userService.verifyUserCredential(username,password);
            const accessToken = this._tokenManager.generateAccessToken({id})
            const refreshToken = this._tokenManager.generateRefreshToken({id})

            await this._authService.addRefreshToken(refreshToken);
 
            const res = h.response({
                status : "success",
                message : "Auth Berhasil",
                data : {
                    accessToken,refreshToken
                }
            })
            res.code(201);
            return res;
        } catch (error) {
            if (error instanceof ClientError) {
                const res = h.response({
                    status:"fail",
                    message : error.message
                })
                res.code(error._statusCode)
                return res;
            }
            const res = h.response({
                status : "error",
                message : "Terjadi kesalahan di server"
            });
            res.code(500)
            console.log(error.message);
            
            return res;
        }
    }

    async putAuthenticationHandler(request,h) {
        try { 
            this._validator.validatePutAuthenticationPayload(request.payload);

            const {refreshToken} = request.payload;
            await this._authService.verifyRefreshToken(refreshToken);
            const {id} = this._tokenManager.verifyRefreshToken(refreshToken)

            const accessToken = this._tokenManager.generateAccessToken({id})

            return {
                status : "success",
                message : "successfully update access key",
                data :{
                    accessToken
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const res = h.response({
                    status:"fail",
                    message : error.message
                })
                res.code(error._statusCode)
                return res;
            }
            const res = h.response({
                status : "error",
                message : "Terjadi kesalahan di server"
            });
            res.code(500)
            console.log(error.message);
            
            return res;
        }
    }

    async deleteAuthenticationHandler(request,h){
        try {
            this._validator.validateDeleteAuthenticationPayload(request.payload)

            const {refreshToken} = request.payload;
            await this._authService.verifyRefreshToken(refreshToken);
            await this._authService.deleteRefreshToken(refreshToken);

            const res = h.response({
                status : "success",
                message : "successfully logout"
            })
            res.code(200);
            return res;
        } catch (error) {
            if (error instanceof ClientError) {
                const res = h.response({
                    status:"fail",
                    message : error.message
                })
                res.code(error._statusCode)
                return res;
            }
            const res = h.response({
                status : "error",
                message : "Terjadi kesalahan di server"
            });
            res.code(500)
            console.log(error.message);
            
            return res;
        }
    }
}
module.exports = AuthHandler;