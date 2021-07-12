const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const {mapDBToModel} = require("../../util");

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
class SongService{
    constructor(){
        this._pool = new Pool()
    }
    async addMusic({title,year,performer,genre,duration}){
        const id = `song-${nanoid(11)}`;
        const insertedAt = new Date().toISOString();
        
        const query ={
            text : 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7,$7) RETURNING id',
            values : [id,title,year,performer,genre,duration,insertedAt]
        }
        const res = await this._pool.query(query);

        if (!res.rows[0].id) {
            throw new InvariantError('Failed Add Music')
        }

        return res.rows[0].id;
    }
    async getMusics(){
        const res = await this._pool.query("SELECT * FROM songs");
        if (!res.rowCount) {
            return []
        }
        return res.rows.map(mapDBToModel);
    }

    async getMusicById(id){
        const query = {
            text : "SELECT * FROM songs WHERE id = $1",
            values:[id]
        }

        const res = await this._pool.query(query)

        if(!res.rowCount){
            throw new NotFoundError("Music is not found")
        }
        return res.rows.map(mapDBToModel)[0];
    }
    async updateMusicById(id, {title,year,performer,genre,duration}){
        
        const updatedAt = new Date().toISOString();
        const query = {
            text : "UPDATE songs set title = $1, year = $2, performer=$3, genre=$4, duration=$5, updated_at=$6 WHERE id = $7 RETURNING id",
            values : [title,year,performer,genre,duration,updatedAt,id]
        }
        const res = await this._pool.query(query);

        if (!res.rowCount) {
            throw new NotFoundError("Music not found");
        }
    }
    async deleteMusicById(id){
        const query = {
            text:"DELETE FROM songs WHERE id = $1 RETURNING id",
            values : [id]
        }
        const res = await this._pool.query(query);
        if (!res.rowCount) {
            throw new NotFoundError("Music not found");
        }
    }
}
module.exports = SongService;