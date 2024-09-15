const { default: MigrationBuilderImpl } = require("node-pg-migrate/dist/migrationBuilder")
const InvariantError = require("../../exceptions/InvariantError")
const { PostPlaylistPayloadSchema, PostPlaylistSongPayloadSchema } = require("./schema")

const PlaylistsValidator = {
    validatePostPlaylistPayload: (payload) => {
        const validatiorResult = PostPlaylistPayloadSchema.validate(payload)
        if (validatiorResult.error) {
            throw new InvariantError(validatiorResult.error.message)
        }
    },
    validatePostPlaylistSongPayload: (payload) => {
        const validationResult = PostPlaylistSongPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = PlaylistsValidator