const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistCollaborationService{
    constructor(){
        this._pool = new Pool();
    }

    async addCollaborator({playlistId,userId}){
        await this.verifyCollaboratorExist({playlistId,userId});
        const id = `plcol-${nanoid(14)}`
        const query = {
            text : "INSERT INTO playlistcollaboration VALUES ($1,$2,$3) RETURNING id",
            values : [id,playlistId,userId]
        }
        const res = await this._pool.query(query);
        if (!res.rowCount) {
            throw new InvariantError("gagal menambahkan collaborator")
        }

        return res.rows[0];
    }

    async deleteCollaborator({playlistId,userId}){
        const query = {
            text : "DELETE FROM playlistcollaboration WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
            values : [playlistId,userId]
        }

        const res = await this._pool.query(query);
        if (!res.rowCount) {
            throw new InvariantError("collaborator tidak ditemukan")
        }
        
    }

    async verifyCollaborator({playlistId,userId}){
        const query = {
            text :"SELECT id FROM playlistcollaboration WHERE playlist_id = $1 AND user_id = $2",
            values : [playlistId,userId]
        }

        const res = await this._pool.query(query);
        if (!res.rowCount) {
            throw new AuthorizationError("anda tidak memiliki akses")
        }
    }
    async verifyCollaboratorExist({playlistId,userId}){
        const query = {
            text :"SELECT id FROM playlistcollaboration WHERE playlist_id = $1 AND user_id = $2",
            values : [playlistId,userId]
        }

        const res = await this._pool.query(query);
        if ( res.rowCount > 0) {
            throw new InvariantError("collaborator sudah ada")
        }
    }
}
module.exports = PlaylistCollaborationService;