const nodemailer = require('nodemailer')
class MailSender{
    constructor(){
        this._transporter  = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port : 465,
            secure : true,
            auth :{
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        })
    }

    sendMail(targetEmail, content){
        const message = {
            from : "song-app",
            to : targetEmail,
            subject : "Ekspor Playlist Songs",
            text : 'terlampir hasil ekspor playlist',
            attachments : [
                {
                    filename : 'playlistsongs.json',
                    content
                }
            ],
        }

        return this._transporter.sendMail(message)
    }
}

module.exports = MailSender;