'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt= require('@hapi/jwt');
const Inert = require('@hapi/inert');
const authentication = require('./api/authentication');
const _exports = require('./api/exports');
const musics = require('./api/music');
const playlist = require('./api/playlist');
const playlistcollaboration = require('./api/playlistcollaboration');
const playlistsong = require('./api/playlistsong');
const uploads = require('./api/uploads');
const users = require('./api/users');
const ClientError = require('./exceptions/ClientError');
const AuthenticationServices = require('./services/postgres/AuthenticationServices');
const PlaylistCollaborationService = require('./services/postgres/PlaylistCollaborationServices');
const PlaylistServices = require('./services/postgres/PlaylistServices');
const PlaylistSongServices = require('./services/postgres/PlaylistSongServices');
const SongService = require('./services/postgres/SongServices');
const UsersService = require('./services/postgres/UsersServices');
const ProducerService = require('./services/rabbitmq/ProducerService');
const StorageServices = require('./services/storage/StorageServices');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationValidator = require('./validator/authentication');
const ExportValidator = require('./validator/exports');
const MusicValidator = require('./validator/music');
const PlaylistValidator = require('./validator/playlist');
const PlaylistCollaborationValidator = require('./validator/playlistcollaboration');
const PlaylistSongsValidator = require('./validator/playlistsong');
const UploadsValidator = require('./validator/uploads');
const UserValidator = require("./validator/users")
const path = require('path');
const CacheServices = require('./services/redis/CacheServices');
const init = async() => {
    const songService = new SongService();
    const userService = new UsersService()
    const authService = new AuthenticationServices();
    const cacheServices = new CacheServices();
    const playlistSongsService = new PlaylistSongServices(cacheServices);
    const playlistCollabService = new PlaylistCollaborationService();
    const playlistService = new PlaylistServices(playlistCollabService);
    const storageService = new StorageServices(path.resolve(__dirname,'api/uploads/file'))
    
    const server = Hapi.server({
        port : process.env.PORT,
        host : process.env.HOST,
        routes : {
            cors:{
                origin : ['*'],
            }
        }
    });

    await server.register([
        {
            plugin : Jwt
        },
        {
            plugin : Inert
        }
    
    ]);

    server.auth.strategy("songapp_jwt",'jwt',{
        keys : process.env.ACCESS_TOKEN_KEY,
        verify : {
            aud : false,
            iss : false,
            sub : false,
            maxAgeSec : process.env.ACCESS_TOKEN_AGE
        },
        validate : (artifacts) => ({
            isValid : true,
            credentials :{
                id : artifacts.decoded.payload.id,
            }
        })
    })

    await server.register([
        {
            plugin: musics,
            options:{
                service : songService,
                validator : MusicValidator
            }
        },
        {
            plugin : users,
            options :{
                service : userService,
                validator : UserValidator
            }
        },
        {
            plugin : authentication,
            options :{
                authService: authService,
                userService : userService,
                tokenManager : TokenManager,
                validator : AuthenticationValidator
            }
        },
        {
            plugin : playlist,
            options : {
                playlistServices : playlistService,
                playlistSongsServices: playlistSongsService,
                validator : PlaylistValidator
            }
        },
        {
            plugin : playlistsong,
            options : {
                playlistService : playlistService,
                playlistSongService : playlistSongsService,
                validator : PlaylistSongsValidator
            }
        },
        {
            plugin : playlistcollaboration,
            options :{
                playlistService : playlistService,
                playlistCollabService : playlistCollabService,
                validator : PlaylistCollaborationValidator
            }
        },
        {
            plugin : _exports,
            options : {
                service: ProducerService,
                validator: ExportValidator,
                playlistService : playlistService
            }
        },
        {
            plugin : uploads,
            options : {
                service: storageService,
                validator : UploadsValidator
            }
        }
    ])
    await server.start();
    server.ext('onPreResponse',(request,h) =>{
        const {response} = request;

        if (response instanceof ClientError) {
            const newRes = h.response({
                status : 'fail',
                message : response.message
            })
            newRes.code(response._statusCode);
            return newRes;
        }
        if (response._statusCode == 500) {
            console.log(response);    
        }
        
        return response.continue || response;
    })
    console.log(`server running in ${server.info.uri}`);
};

process.on('unhandledRejection',(err)=>{

    console.log(err);
    process.exit(1);
});


init();