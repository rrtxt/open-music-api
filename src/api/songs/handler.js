class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
  }

  async postSongsHandler(request, h) {
    this._validator.validatePayload(request.payload)

    const { title, year, performer, genre, duration, albumId } = request.payload

    const songId = await this._service.addSong({ title, year, performer, genre, duration, albumId })

    const response = h.response({
      status: 'success',
      data: {
        songId
      }
    })

    response.code(201)
    return response
  }

  async getAllSongsHandler(request, h) {
    const songs = await this._service.getSongs()

    const response = h.response({
      status: 'success',
      data: {
        songs
      }
    })

    response.code(200)
    return response
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)

    const response = h.response({
      status: 'success',
      data: {
        song
      }
    })

    response.code(200)
    return response
  }

  async editSongByIdhandler(request, h) {
    this._validator.validatePayload(request.payload)
    const { id } = request.params
    const { title, year, genre, performer, duration, albumId } = request.payload

    const songId = await this._service.editSongById(id, {
      title, year, genre, performer, duration, albumId
    })

    const response = h.response({
      status: 'success',
      message: 'Song berhasil diedit'
    })

    response.code(200)
    return response
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params

    const songId = await this._service.deleteSongById(id)

    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus'
    })

    response.code(200)
    return response
  }
}

module.exports = { SongsHandler }
