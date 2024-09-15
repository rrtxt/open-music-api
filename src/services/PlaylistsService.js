const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { AuthorizationError } = require("../exceptions/AuthError");

class PlaylistsService {
    constructor() {
        this._pool = new Pool
    }

    async addPlaylist(name) {
        const id = nanoid(16)
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2) RETURNING id',
            values: [id, name]
        }

        const result = await this._pool.query(query)
        if (!result.rows[0].id) {
            throw new InvariantError('Playlists gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getPlaylistById(playlistId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId]
        }

        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan')
        }

        return result.rows[0]
    }

    async getPlaylistsByUser(userId) {
        const query = {
            text: 'SELECT p.*, u.username FROM playlists p JOIN users u ON p.id = u.id ',
            values: [userId]
        }

        const result = await this._pool.query(query)

        return result.rows
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
        }

        return result.rows
    }

    async addSongToPlaylist(playlistId, songId) {
        const query = {
            text: 'INSERT INTO playlists_songs VALUES ($1, $2)',
            values: [playlistId, songId]
        }

        const result = await this._pool.query(query)
        if (!result.rows[0].length) {
            throw new InvariantError('Gagal menambahkan song ke playlist')
        }
    }

    async getSongsByPlaylistId(playlistId) {
        const query = {
            text: "SELECT p.id as playlist_id, p.name, u.username, s.id as song_id, s.title, s.performer  FROM playlists p \
                   JOIN playlists_songs ps \
                   ON p.id = ps.playlist_id \
                   JOIN users u \
                   ON p.user_id = u.id \
                   JOIN songs s ON s.id = ps.id \
                   WHERE p.id = $1",
            values: [playlistId]
        }

        const result = await this._pool.query(query)

        return result.rows
    }

    async deleteSongInPlaylists(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlists_songs WHERE playlist_id = $1, song_id = $2',
            values: [playlistId, songId]
        }

        await this._pool.query(query)
    }

    async verifyPlaylistOwner(userId, playlistId) {
        const query = {
            text: 'SELECT id FROM playlists id = $1',
            values: [playlistId]
        }

        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan')
        }

        const playlist = result.rows[0]
        if (playlist.user_id === userId) {
            throw new AuthorizationError('Tidak dapat mengakses playlist ini')
        }
    }
}

module.exports = PlaylistsService