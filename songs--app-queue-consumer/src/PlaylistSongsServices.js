const { Pool } = require("pg");

class PlaylistSongsServices{
    constructor(){
        this._pool = new Pool();
    }

    async getPlaylist({playlistId}) {
        const query = {
            text : "SELECT songs.id,title,performer FROM playlistsongs INNER JOIN songs ON playlistsongs.song_id = songs.id WHERE playlistsongs.playlist_id = $1 ",
            values :[playlistId]
        }

        const res = await this._pool.query(query);

        if (!res.rowCount) {
            return [];
        }
        return res.rows;
    }
}

module.exports = PlaylistSongsServices;