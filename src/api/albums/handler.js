const NotFoundError = require("../../exceptions/NotFoundError")

class AlbumsHandler {
  constructor(albumsService, songsService, validator) {
    this._albumsService = albumsService
    this._songsService = songsService
    this._validator = validator
  }

  async postAlbumHandler(request, h) {
    this._validator.validatePayload(request.payload)

    const { name, year } = request.payload
    const albumId = await this._albumsService.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      data: { albumId }
    })

    response.code(201)

    return response
  }

  async getAlbumsHandler() {
    const albums = await this._albumsService.getAlbums()
    const response = h.response({
      status: 'success',
      data: {
        album: albums
      }
    })

    response.code(200)
    return response
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params
    const album = await this._albumsService.getAlbumById(id)
    const songs = await this._songsService.getSongs({ albumId: id })
    const newSongs = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }))

    const response = h.response({
      status: 'success',
      data: {
        album: {
          ...album,
          songs: newSongs
        }
      }
    })
    response.code(200)
    return response
  }

  async editAlbumByIdHandler(request, h) {
    this._validator.validatePayload(request.payload)
    const { id } = request.params
    const { name, year } = request.payload
    const albumId = await this._albumsService.editAlbumById(id, { name, year })
    const response = h.response({
      status: 'success',
      message: 'Album berhasil diedit'
    })

    response.code(200)
    return response
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params
    const albumId = await this._albumsService.deleteAlbumById(id)

    const response = h.response({
      status: 'success',
      message: `Album berhasil dihapus`
    })

    response.code(200)

    return response
  }
}

module.exports = { AlbumsHandler }
