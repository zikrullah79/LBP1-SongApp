const ClientError = require("../../exceptions/ClientError");


class PlaylistsHandler {
    constructor(playlistServices,playlistSongsServices,validator){
        this._playlistServices = playlistServices;
        this._playlistSongServices = playlistSongsServices;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request,h){
        try {
            this._validator.validatePlaylistPayload(request.payload);
            const {name} = request.payload;
            const {id : credentialId} = request.auth.credentials
            const playlistId = await this._playlistServices.addPlaylist({name,owner : credentialId})
            
            const res = h.response({
                status : 'success',
                message : "Successfully add Playlist",
                data :{
                    playlistId
                }
            })
            res.code(201)
            return res ;
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
    
    async getPlaylistsHandler(request,h) {
        try {
            const {id} = request.auth.credentials;
            const playlists = await this._playlistServices.getPlaylists(id);
            return {
                status : "success",
                message : "Successfully get your playlist",
                data : {playlists}
                
            }
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
    async deletePlaylistHandler(request,h){
        try {
            const {id : credentialsId} = request.auth.credentials;
            const {playlistId} = request.params; 

            await this._playlistServices.verifyPlaylist({id : playlistId ,owner:credentialsId})

            await this._playlistServices.deletePlaylist({id : playlistId ,owner:credentialsId})
            await this._playlistSongServices.deleteAllSongPlaylist(playlistId)
            return {
                status : "success",
                message : "Success Deleting Playlist"
            }
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
}

module.exports = PlaylistsHandler