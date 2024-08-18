class AlbumsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
  }

  async postAlbumHandler(request, h) {
    this._validator.validatePayload(request.payload)

    const { name = 'unnamed', year } = request.payload
    const albumId = await this._service.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      data: { albumId }
    })

    response.code(201)

    return response
  }

  async getAlbumsHandler() {
    const albums = this._service.getAlbums()
    const response = h.response({
      status: 'success',
      data: {
        album: albums
      }
    })

    response.code(200)
    return response
  }
}

module.exports = { AlbumsHandler }
