const ClientError = require("../../exceptions/ClientError")
const { SongsPayloadSchema } = require("./schema")

const SongsValidator = {
  validatePayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  }
}

module.exports = SongsValidator
