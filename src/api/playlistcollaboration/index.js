const PlaylistCollaborationHandler = require("./handler")
const routes = require("./routes")

module.exports = {
    name : "playlistcollaboration",
    version : "1.0.0",
    register : async (server,{playlistService,playlistCollabService,validator}) => { 
        const plCollabHandler = new PlaylistCollaborationHandler(playlistService,playlistCollabService,validator)

        server.route(routes(plCollabHandler));
    }
}