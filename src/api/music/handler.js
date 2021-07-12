const ClientError = require("../../exceptions/ClientError");

class MusicHandler{
    constructor(service,validator){
        this._service = service;
        this._validator = validator;
        this.postMusicHandler = this.postMusicHandler.bind(this);
        this.getMusicsHandler = this.getMusicsHandler.bind(this);
        this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this);
        this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this);
        this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this);
    }

    async postMusicHandler(request,h){
        try {
            this._validator.validateMusicPayload(request.payload);
            const {title = 'untitled',year,performer,genre,duration} = request.payload;
            
            const songId = await this._service.addMusic({title,year,performer,genre,duration});

            const res = h.response({
                status : 'success',
                message : "Successfully add Music",
                data : {
                    songId,
                },
            });
            res.code(201);
            return res;
        } catch (error) {
            if (error instanceof ClientError) {
                const res = h.response({
                    status : 'fail',
                    message : error.message,
                });
    
                res.code(error._statusCode);    
                return res;
            }
            const res = h.response({
                status : 'error',
                message : "There is error in our server",
            });

            res.code(500);
            console.log(error);
            return res;
        }
        
    }
    async getMusicsHandler(){
        const songs = await this._service.getMusics();
        return {
            status : "success",
            message : "Successfully get all musics",
            data : {
                songs : songs.map(this.filterResponse)
            }
        }
    }

    async getMusicByIdHandler(request,h){
        try {
            const {id} = request.params;
            const song = await this._service.getMusicById(id);
            return {
                status : 'success',
                message : 'successfully get Music',
                data : {
                    song,
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const res = h.response({
                    status : 'fail',
                    message : error.message,
                })
                res.code(error._statusCode)    
                return res
            }
            const res = h.response({
                status : 'error',
                message : "There is error in our server",
            });

            res.code(500);
            console.log(error);
            return res;
        }
        

    }

    async putMusicByIdHandler(request,h){
        try {
            this._validator.validateMusicPayload(request.payload);
            const {id} = request.params;
            await this._service.updateMusicById(id,request.payload);
            return {
                status:'success',
                message : "successfully update music"
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const res = h.response({
                    status:'fail',
                    message : error.message
                });
                res.code(error._statusCode);
                return res;
            }

            const res = h.response({
                status : 'error',
                message : "There is error in our server",
            });

            res.code(500);
            console.log(error);
            return res;
        }
    }
    async deleteMusicByIdHandler(request,h){
        try {
            const {id} = request.params;

            await this._service.deleteMusicById(id);

            return {
                status : 'success',
                message : "succesfully delete music"
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const res = h.response({
                    status : "fail",
                    message : error.message
                });
                res.code(error._statusCode);
                return res;
            }

            const res = h.response({
                status : 'error',
                message : "There is error in our server",
            });

            res.code(500);
            console.log(error);
            return res;
        }
    }
    filterResponse(song){
        console.log(song);
        return {
            id:song.id,
            title:song.title,
            performer : song.performer
        }
    }   
}
module.exports = MusicHandler;