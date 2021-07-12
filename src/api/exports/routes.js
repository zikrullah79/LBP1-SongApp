const routes = (handler) =>[
    {
        method : 'POST',
        path : '/exports/playlists/{playlistId}',
        handler : handler.postPlaylistExportHandler,
        options :{
            auth : 'songapp_jwt'
        }
    }
]

module.exports = routes;