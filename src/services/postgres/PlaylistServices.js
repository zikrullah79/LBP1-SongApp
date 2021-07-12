const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const NotFoundError = require('../../exceptions/NotFoundError');
class PlaylistServices{
    constructor(collaborationService){
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addPlaylist({name,owner}){
        const id = `playlist-${nanoid(11)}`
        const query = {
            text : "INSERT INTO playlists VALUES ($1,$2,$3) RETURNING id",
            values : [id,name,owner]
        }
        const res = await this._pool.query(query)
        if (!res.rows.length) {
            throw new InvariantError("Gagal Menambahkan Playlist")
        }

        return res.rows[0].id
    }

    async getPlaylists(owner){
        const query = {
            // text : `SELECT r.id,r.name,s.username FROM 
            // (SELECT * FROM playlists pl INNER JOIN (SELECT playlist_id,user_id FROM playlistcollaboration WHERE user_id = $1) t ON pl.id = t.playlist_id) r 
            //     INNER JOIN users s ON r.owner = s.id WHERE r.owner = $1 OR r.user_id = $1`,
            // text : `SELECT * FROM playlists WHERE owner = $1 `,
            // text : `SELECT playlist_id FROM playlistcollaboration WHERE user_id = $1 `,
            // text : `SELECT * FROM playlists pl INNER JOIN (SELECT playlist_id FROM playlistcollaboration WHERE user_id = $1) p ON pl.id = p.playlist_id  `,
            // text : `SELECT * FROM playlists pl INNER JOIN (SELECT playlist_id,user_id FROM playlistcollaboration WHERE user_id = $1) t ON pl.id = t.playlist_id`,
           text : `SELECT p.id,p.name,u.username FROM (SELECT * FROM playlists WHERE owner = $1 
            OR id = (SELECT playlist_id FROM playlistcollaboration WHERE user_id = $1 )) p INNER JOIN users u 
            ON p.owner = u.id`,
            values : [owner]
        }
        
        const res = await this._pool.query(query);
        if (!res.rows.length) {
            return []
        }
        
        return res.rows;
    }

    async deletePlaylist({id,owner}){
        await this.verifyPlaylist({id,owner});

        const query = {
            text : "DELETE FROM playlists WHERE id = $1 ",
            values :[id]
        }

        await this._pool.query(query);


    }

    async verifyPlaylistAccess({playlistId,userId}){
        try {
            await this.verifyPlaylist({id:playlistId,owner : userId})
        } catch (error) {
            if (error instanceof InvariantError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator({playlistId,userId})    
            } catch (error) {
                throw error;
            }
            

        }
    }
    async verifyPlaylist({id,owner}){
        const query = {
            text : "SELECT owner FROM playlists WHERE id = $1",
            values : [id]
        }

        const res = await this._pool.query(query);

        if (!res.rows.length) {
            throw new InvariantError("playlist tidak ditemukan")
        }

        const {owner : playlistOwner } = res.rows[0];

        if (playlistOwner !== owner ) {
            throw new AuthorizationError("anda tidak memiliki hak untuk mengakses playlist ini");
        }
    }
}

module.exports = PlaylistServices;