class Listener{
    constructor(service,mailSender){
        this._service = service;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this)
    }

    async listen(message){
        try {
            const {playlistId,targetEmail} = JSON.parse(message.content.toString());

            const playlistSongs = await this._service.getPlaylist({playlistId})
            const result = this._mailSender.sendMail(targetEmail,JSON.stringify(playlistSongs))

            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = Listener;