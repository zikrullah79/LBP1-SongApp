const ClientError = require("../../exceptions/ClientError");
const { filterResponse } = require("../../util");

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
        
    }
    async getMusicsHandler(){
        const songs = await this._service.getMusics();
        return {
            status : "success",
            message : "Successfully get all musics",
            data : {
                songs : songs.map(filterResponse)
            }
        }
    }

    async getMusicByIdHandler(request,h){
            const {id} = request.params;
            const song = await this._service.getMusicById(id);
            return {
                status : 'success',
                message : 'successfully get Music',
                data : {
                    song,
                }
            }
        

    }

    async putMusicByIdHandler(request,h){
            this._validator.validateMusicPayload(request.payload);
            const {id} = request.params;
            await this._service.updateMusicById(id,request.payload);
            return {
                status:'success',
                message : "successfully update music"
            }
        
    }
    async deleteMusicByIdHandler(request,h){
            const {id} = request.params;

            await this._service.deleteMusicById(id);

            return {
                status : 'success',
                message : "succesfully delete music"
            }
        
    }
}
module.exports = MusicHandler;