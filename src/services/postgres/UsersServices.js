const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError')
const AuthenticationError = require('../../exceptions/AuthenticationError')
const bcrypt = require("bcrypt");

class UsersService{
    constructor(){
        this._pool = new Pool();
    
    }

    async addUser({username,password,fullname}){
        await this.verifyUsername(username)
        const id = `user-${nanoid(14)}`
        const pass = await bcrypt.hash(password,10);

        const query = {
            text : 'INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id',
            values : [id,username,pass,fullname]
        }

        const res = await this._pool.query(query)
        if (!res.rows.length) {
            throw new InvariantError("Gagal menambahkan user")
        }

        return res.rows[0].id;
    }

    async getUserById(userId){
        const query = {
            text:"SELECT id,username,fullname FROM users WHERE id = $1",
            values:[userId]
        }
        const res = await this._pool.query(query);

        if (!res.rows.length) {
            throw new InvariantError("User tidak ditemukan")
        }

        return res.rows[0]
    }

    

    async verifyUsername(username){
        const query = {
            text : 'SELECT username FROM users WHERE username = $1',
            values : [username],
        };
        const res = await this._pool.query(query);
        
        if (res.rows.length > 0 ) {
            throw new InvariantError("User telah terdaftar")
        }

    
    }

    async verifyUserCredential(username,password){
        const query = {
            text : "SELECT * FROM users WHERE username = $1",
            values : [username]
        }
        const res = await this._pool.query(query)

        if (!res.rows.length) {
            throw new AuthenticationError("user tidak valid")
        }

        const {id,password : hashedPassword} = res.rows[0];
        const match =await bcrypt.compare(password,hashedPassword);
        if (!match) {
            throw new AuthenticationError("Kredensial yang anda berikan salah")
        }
        return id;
    }

}
module.exports = UsersService