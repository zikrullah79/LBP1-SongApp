require('dotenv').config();
const amqp = require('amqplib');
const Listener = require('./listener');
const MailSender = require('./MailSender');
const PlaylistSongsServices = require('./PlaylistSongsServices');

const init = async () =>{
    const playlistSongService = new PlaylistSongsServices();
    const mailSender = new MailSender();
    const listener = new Listener(playlistSongService,mailSender);

    const connect = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connect.createChannel();

    await channel.assertQueue("export:playlist",{
        durable:true
    });

    channel.consume("export:playlist",listener.listen,{noAck : true});
}

init();