const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at
})=>({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt:inserted_at,
    updatedAt:updated_at
})

const filterResponse = (song) =>{
    return {
        id:song.id,
        title:song.title,
        performer : song.performer
    }
}
module.exports = {mapDBToModel,filterResponse};