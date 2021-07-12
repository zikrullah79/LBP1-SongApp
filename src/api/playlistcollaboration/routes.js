
const routes = (handler) =>[
    {
        method : "POST",
        path : "/collaborations",
        handler : handler.postPlaylistCollaborationHandler,
        options : {
            auth : 'songapp_jwt'
        },
    },
    {
        method : "DELETE",
        path : "/collaborations",
        handler : handler.deletePlaylistCollaborationHandler,
        options : {
            auth : 'songapp_jwt'
        },
    }
]

module.exports = routes;