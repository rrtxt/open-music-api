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
    pgm.addColumn('playlists', {
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    })

    pgm.addConstraint('playlists', 'fk_playlists.user_id_user.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)'
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => { };
