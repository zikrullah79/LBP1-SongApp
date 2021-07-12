const ClientError = require("../../exceptions/ClientError");


class PlaylistSongsHandler{
    constructor(playlistService,playlistSongService,validator){
        this._playlistService = playlistService;
        this._playlistSongService = playlistSongService;
        this._validator = validator;

        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    }

    async postPlaylistSongHandler(request, h){
            const {playlistId} = request.params;
            const {id : credentialsId} = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess({playlistId : playlistId,userId:credentialsId});

            this._validator.validatePlaylistSongsPayload(request.payload)
            const {songId} = request.payload;
            const id = await this._playlistSongService.addSongToPlaylist(playlistId,songId)
            const res = h.response({
                status : "success",
                message : "Successfully add song",
                data : {id}
            })
            res.code(201);
            return res;
        
    }

    async getPlaylistSongsHandler(request,h){
        const {playlistId} = request.params;
            const {id : credentialsId} = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess({playlistId : playlistId,userId:credentialsId});

            const songs = await this._playlistSongService.getSongsPlaylist(playlistId);

            const res = h.response({
                status : "success",
                message : "Successfully get all songs",
                data : {
                    songs
                }
            })
            res.code(200);
            return res;
        
    }
    async deletePlaylistSongHandler(request , h){
         this._validator.validatePlaylistSongsPayload(request.payload);
            const {songId} = request.payload;
            const {playlistId} = request.params;
            const {id : credentialsId} = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess({playlistId : playlistId,userId:credentialsId});
            

            await this._playlistSongService.deleteSongPlaylist(playlistId,songId);
            return {
                status : "success",
                message : "Success Deleting song from playlist"
            }
        
    }
} 
module.exports = PlaylistSongsHandler;