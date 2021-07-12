

const routes = (handler) =>[
    {
        method : "POST",
        path : "/playlists",
        handler : handler.postPlaylistHandler,
        options : {
            auth : 'songapp_jwt'
        },
    },
    {
        method : "GET",
        path :"/playlists",
        handler : handler.getPlaylistsHandler,
        options : {
            auth : 'songapp_jwt'
        },
    },
    {
        method :"DELETE",
        path : "/playlists/{playlistId}",
        handler : handler.deletePlaylistHandler,
        options : {
            auth : 'songapp_jwt'
        },
    }
]

module.exports = routes