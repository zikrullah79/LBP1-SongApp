
const routes = (handler) => [
    {
        method : "POST",
        path : "/playlists/{playlistId}/songs",
        handler : handler.postPlaylistSongHandler,
        options : {
            auth : 'songapp_jwt'
        },
    },
    {
        method : "GET",
        path :"/playlists/{playlistId}/songs",
        handler : handler.getPlaylistSongsHandler,
        options : {
            auth : 'songapp_jwt'
        },
    },
    {
        method : "DELETE",
        path : "/playlists/{playlistId}/songs",
        handler : handler.deletePlaylistSongHandler,
        options : {
            auth : 'songapp_jwt'
        },
    }
]
module.exports = routes;