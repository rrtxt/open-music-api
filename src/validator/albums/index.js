const ClientError = require("../../exceptions/ClientError")
const { AlbumsPayloadSchema } = require("./schema")

const AlbumsValidator = {
  validatePayload: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  }
}

module.exports = AlbumsValidator
