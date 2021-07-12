
class ExportsHandler {
    constructor(service,validator,playlistService){
        this._service = service;
        this._validator = validator;
        this._playlistService = playlistService;

        this.postPlaylistExportHandler = this.postPlaylistExportHandler.bind(this);
    }

    async postPlaylistExportHandler (request,h){
        this._validator.validateExportPayload(request.payload);
        const {id : credentialsId} = request.auth.credentials;
        const {playlistId} = request.params;
        await this._playlistService.verifyPlaylistAccess({playlistId : playlistId,userId:credentialsId});
        const message = {
            playlistId : playlistId,
            targetEmail : request.payload.targetEmail
        }

        await this._service.sendMessage('export:playlist',JSON.stringify(message));

        const res = h.response({
            status : "success",
            message : 'please wait'
        })
        res.code(201);
        return res
    }
}
module.exports = ExportsHandler;