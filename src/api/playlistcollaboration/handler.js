const ClientError = require("../../exceptions/ClientError");


class PlaylistCollaborationHandler{
    constructor(playlistService,playlistCollabService,validator){
        this._playlistService = playlistService;
        this._playlistCollabService = playlistCollabService;
        this._validator = validator;

        this.postPlaylistCollaborationHandler = this.postPlaylistCollaborationHandler.bind(this);
        this.deletePlaylistCollaborationHandler = this.deletePlaylistCollaborationHandler.bind(this);

    }

    async postPlaylistCollaborationHandler(request,h){
            this._validator.validatePlaylistCollaborationPayload(request.payload);
            const {userId , playlistId} = request.payload;
            const {id : credentialsId} = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess({playlistId : playlistId,userId:credentialsId});

            const collabId = await this._playlistCollabService.addCollaborator({playlistId,userId})
            const res = h.response({
                status : "success",
                message : "successfully add collaborator",
                data : {collabId}
            })
            res.code(201);
            return res;
        
    }
    async deletePlaylistCollaborationHandler(request,h){
            this._validator.validatePlaylistCollaborationPayload(request.payload);
            const {playlistId,userId} = request.payload;
            const { id:credentialsId} = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess({playlistId : playlistId,userId:credentialsId});
            
            await this._playlistCollabService.deleteCollaborator({playlistId,userId})

            return {
                status:"success",
                message : "Berhasil Menghapus Collaborator"
            }
        
    }
}
module.exports = PlaylistCollaborationHandler;