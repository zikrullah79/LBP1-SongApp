'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const musics = require('./api/music');
const SongService = require('./services/postgres/SongServices');
const MusicValidator = require('./validator/music');

const init = async() => {
    const songService = new SongService();

    const server = Hapi.server({
        port : process.env.PORT,
        host : process.env.HOST,
        routes : {
            cors:{
                origin : ['*'],
            }
        }
    });
    await server.register({
        plugin: musics,
        options:{
            service : songService,
            validator : MusicValidator
        }
    })
    await server.start();
    console.log(`server running in ${server.info.uri}`);
};

process.on('unhandledRejection',(err)=>{

    console.log(err);
    process.exit(1);
});


init();