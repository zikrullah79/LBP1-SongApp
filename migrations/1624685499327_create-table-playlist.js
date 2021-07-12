

exports.up = pgm => {
    pgm.createTable("playlists",{
        id : {
            type : "VARCHAR(20)",
            primaryKey : true
        },
        name : {
            type : "TEXT",
            notNull : true
        },
        owner : {
            type : "VARCHAR(20)",
            notNull : true
        }
    })
    pgm.sql("INSERT INTO users VALUES ('old_playlist','old_playlist','old_playlist','old_playlist')");
    pgm.sql("UPDATE playlists SET owner = 'old_playlist' WHERE owner = NULL ");
    pgm.addConstraint("playlists","fk_playlists.owner_users.id","FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE");
};

exports.down = pgm => {
    pgm.dropConstraint("playlists","fk_playlists.owner_users.id");
    pgm.dropTable("playlists");
};
