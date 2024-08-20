const NotFoundError = require("../../exceptions/NotFoundError")

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
  }

  async postAlbumHandler(request, h) {
    this._validator.validatePayload(request.payload)

    const { name, year } = request.payload
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

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params
    try {
      const album = this._service.getAlbumById(id)
      const response = h.response({
        status: 'success',
        data: {
          album
        }
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(404)
        return response
      }
    }


    response.code(200)
    return response
  }

  async editAlbumByIdHandler(request, h) {
    this._validator.validatePayload(request.payload)
    const { name, year } = request.payload

    const albumId = await this._service.editAlbumById({ name, year })

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diedit'
    })

    response.code(200)

    return response
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params
    const albumId = this._service.deleteAlbumById(id)

    const response = h.response({
      status: 'success',
      message: `Album dengan id ${albumId} dihapus`
    })

    response.code(200)

    return response
  }
}

module.exports = { AlbumsHandler }
