const ExportsHandler = require("./handler")
const routes = require("./routes")

module.exports = {
    name:"export",
    version:"1.0.0",
    register : async (server,{service,validator,playlistService}) =>{
        const handler = new ExportsHandler(service,validator,playlistService)

        server.route(routes(handler))
    }
}