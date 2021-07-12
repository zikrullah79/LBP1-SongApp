const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
class AuthenticationServices{
    constructor(){
        this._pool = new Pool();
    }

    async addRefreshToken(token){
        const query = {
            text : "INSERT INTO authentications VALUES ($1)",
            values : [token],
        }
        await this._pool.query(query);
    }

    async verifyRefreshToken(token){
        const query = {
            text : "SELECT token FROM authentications WHERE token = $1",
            values : [token]
        }
        const res = await this._pool.query(query);
        if (!res.rowCount) {
            throw new InvariantError("Refresh Token tidak valid")
        }
    }

    async deleteRefreshToken(token){
        await this.verifyRefreshToken(token)

        const query = {
            text : "DELETE FROM authentications WHERE token=$1",
            values : [token],
        }

        await this._pool.query(query)
    }
}

module.exports = AuthenticationServices;