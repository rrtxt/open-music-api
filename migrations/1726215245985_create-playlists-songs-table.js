/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlists_songs', {
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    })

    pgm.addConstraint('playlists_songs', 'fk_playlists_songs.playlist_id_playlists.id', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)',
            onDelete: 'CASCADE'
        }
    })

    pgm.addConstraint('playlists_songs', 'fk_playlists_songs.song_id_songs.id', {
        foreignKeys: {
            columns: 'song_id',
            references: 'songs(id)',
            onDelete: 'CASCADE'
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.playlist_id_playlists.id')
    pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.song_id_song.id')

    pgm.dropTable('playlists_songs')
};
