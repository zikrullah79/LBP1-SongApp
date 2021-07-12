const PlaylistsHandler = require("./handler");
const routes = require("./routes");


module.exports = {
    name : "Playlists",
    version : "1.0.0",
    register : async (server,{playlistServices,playlistSongsServices,validator}) =>{
        const playlistsHandler = new PlaylistsHandler(playlistServices,playlistSongsServices,validator);

        server.route(routes(playlistsHandler));
    }
}