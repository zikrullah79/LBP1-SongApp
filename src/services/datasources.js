const {nanoid} = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class MusicService{
    constructor(){
        this._musics = []
    }

    addMusic({title,year,performer,genre,duration}){
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const newMusic = {id,title,year,performer,genre,duration,insertedAt,updatedAt}
        
        this._musics.push(newMusic)

        const isSuccess = this._musics.filter((music)=>music.id === id).length > 0;
        if (!isSuccess) {
            throw new InvariantError('Failed Add Music')
        }

        return id;
    }
    getMusics(){
        return this._musics;
    }

    getMusicById(id){
        const music = this._musics.filter((n)=>n.id === id)[0];
        if(!music){
            throw new NotFoundError("Music is not found")
        }
        return music;
    }
    updateMusicById(id, {title,year,performer,genre,duration}){
        const idx = this._musics.findIndex((m)=>m.id === id)

        if (idx === -1) {
            throw new NotFoundError("Music not found");
        }

        const updatedAt = new Date().toISOString();

        this._musics[idx]={
            ...this._musics[idx],
            title,
            year,
            performer,
            genre,
            duration,
            updatedAt
        }
    }
    deleteMusicById(id){
        const idx = this._musics.findIndex((m)=>m.id === id);
        if (idx === -1) {
            throw new NotFoundError("Music not found");
        }
        this._musics.splice(idx,1);
    }
}

module.exports = MusicService;