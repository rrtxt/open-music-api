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
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    })

    pgm.createTable('collaborations', {
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        isOwner: {
            type: 'BOOLEAN',
            notNull: true
        }
    })

    pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)'
        }
    })

    pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', {
        foreignKeys: {
            columns: 'playlist_id',
            references: 'playlists(id)'
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id')

    pgm.dropTable('playlists');
    pgm.dropTable('collaborations')
};
