const ClientError = require("../../exceptions/ClientError")

class UsersHandler {
    constructor(service,validator){
        this._service = service;
        this._validator = validator;
        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    }

    async postUserHandler(request,h){
        try {
            this._validator.validatePayloads(request.payload);
            const {username,password,fullname} = request.payload;

            const userId = await this._service.addUser({username,password,fullname});

            const res = h.response({
                status : "success",
                message : "user berhasil ditambahkan",
                data : {userId}
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
    async getUserByIdHandler(request,h){
        try {
            const {id} = request.params;
            const user = await this._service.getUserById(id);

            const res = h.response({
                status : "success",
                message : "succesfully get user",
                data : {user}
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
            return res;
        }
    }

}
module.exports =  UsersHandler