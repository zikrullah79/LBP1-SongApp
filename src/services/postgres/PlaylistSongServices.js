const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");


class PlaylistSongServices{
    constructor(){
        this._pool = new Pool()
    }
    async addSongToPlaylist(playlistId,songId){
        await this.verifyPlaylistSongs(playlistId,songId);

        const id = `plsongs-${nanoid(12)}`
        const query = {
            text : "INSERT INTO playlistsongs VALUES($1,$2,$3) RETURNING id",
            values : [id,playlistId,songId]
        }

        const res = await this._pool.query(query);
        if (!res.rows.length) {
            throw new InvariantError("Gagal menambahkan lagu")
        }
        return res.rows[0].id;
    }
    async getSongsPlaylist(playlistId){
        const query = {
            text : "SELECT songs.id,title,performer FROM playlistsongs INNER JOIN songs ON playlistsongs.song_id = songs.id WHERE playlistsongs.playlist_id = $1 ",
            values :[playlistId]
        }

        const res = await this._pool.query(query);

        if (!res.rows.length) {
            return [];
        }
        return res.rows;
    }
    async deleteSongPlaylist(playlistId,songId){
        const query= { 
            text : "DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
            values :[playlistId,songId]
        }
        const res = await this._pool.query(query);
        if (!res.rows.length) {
            throw new InvariantError("lagu tidak ditemukan")
        }
        
    }
    async deleteAllSongPlaylist(playlistId){
        const query = {
            text :"DELETE FROM playlistsongs WHERE playlist_id = $1 ",
            values : [playlistId]
        }
        const res = await this._pool.query(query);
    }
    async verifyPlaylistSongs(playlistId, songId){
        const query = {
            text : "SELECT id FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2",
            values : [playlistId,songId]
        }

        const res = await this._pool.query(query);
        if (res.rows.length > 0) {
            throw new InvariantError("Gagal Menambahkan lagu, lagu sudah ada dalam playlist")
        }
    }
}

module.exports = PlaylistSongServices;