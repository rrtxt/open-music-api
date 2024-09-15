const { default: mod } = require("@hapi/jwt")
const playlists = require(".")

class PlaylistHandler {
    constructor(playlistsService, songsService, validator) {
        this._playlistsService = playlistsService
        this._songsService = songsService
        this._validator = validator
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePostPlaylistPayload(request.payload)
        const { name } = request.payload
        const { id: credentialId } = request.auth.credentials

        const playlistId = await this._playlistsService.addPlaylist(name, credentialId)

        const response = h.response({
            status: 'success',
            data: {
                playlistId
            }
        })

        response.code(201)
        return response
    }

    async getUserPlaylistsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials

        const playlists = await this._playlistsService.getPlaylistsByUser(credentialId)
        const playlistsData = playlists.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            username: playlist.username
        }))

        const response = h.response({
            status: 'success',
            data: {
                playlists: playlistsData
            }
        })
        response.code(200)
        return response
    }

    async deletePlaylistByIdHandler(request, h) {
        const { id: credentialId } = request.auth.credentials
        const { playlistId } = request.params
        await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId)
        await this._playlistsService.deletePlaylistById(playlistId)

        const response = h.response({
            status: 'success',
            message: 'Berhasil menghapus playlist'
        })

        response.code(200)
        return response
    }

    async postSongPlaylistByIdHandler(request, h) {
        this._validator.validatePostPlaylistSongPayload(request.payload)
        const { playlistId } = request.params
        const { songId } = request.payload
        const { id: credentialId } = request.auth.credentials

        await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId)
        await this._songsService.getSongById(songId)
        await this._playlistsService.addSongToPlaylist(playlistId, songId)

        const response = h.response({
            status: 'success',
            message: 'Berhasil menambahkan song ke playlist'
        })
        response.code(201)
        return response
    }

    async getSongPlaylistHandler(request, h) {
        const { id: credentialId } = request.auth.credentials
        const { playlistId } = request.params
        await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId)
        await this._playlistsService.getPlaylistById(playlistId)

        const result = await this._playlistsService.getSongsByPlaylistId(playlistId)
        const songs = result.map(row => ({
            id: row.song_id,
            title: row.title,
            performer: row.performer
        }))
        const data = {
            id: result[0].playlist_id,
            name: result[0].name,
            username: result[0].username,
            songs
        }

        const response = h.response({
            status: 'success',
            data: {
                playlist: data
            }
        })
        response.code(200)
        return response
    }

    async deleteSongInPlaylistHandler(request, h) {
        this._validator.validatePostPlaylistSongPayload(request.payload)
        const { id: credentialId } = request.auth.credentials
        const { playlistId } = request.params
        const { songId } = request.payload

        await this._playlistsService.verifyPlaylistOwner(credentialId, playlistId)
        await this._playlistsService.getPlaylistById(playlistId)
        await this._songsService.getSongById(songId)

        await this._playlistsService.deleteSongInPlaylist(playlistId, songId)

        const response = h.response({
            status: 'success',
            message: 'song di playlist berhasil dihapus'
        })
        response.code(200)
        return response
    }

}

module.exports = { PlaylistHandler }