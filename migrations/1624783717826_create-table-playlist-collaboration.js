/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("playlistcollaboration",{
        id : {
            type : "VARCHAR(20)",
            primaryKey : true
        },
        playlist_id : {
            type : "VARCHAR(20)",
            notNull : true
        },
        user_id : {
            type : "VARCHAR(20)",
            notNull : true
        }
    })
    pgm.addConstraint("playlistcollaboration","unique_playlist_id_and_user_id","UNIQUE(playlist_id,user_id)")
    pgm.addConstraint("playlistcollaboration","fk_playlist_id_playlistcollaboration","FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE")
    pgm.addConstraint("playlistcollaboration","fk_user_id_playlistcollaboration","FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")
};

exports.down = pgm => {
    pgm.dropTable("playlistcollaboration")
};
