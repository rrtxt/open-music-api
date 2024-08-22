require('dotenv').config();

const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const AlbumsService = require('./services/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const albums = require('./api/albums');
const songs = require('./api/songs');
const { SongsService } = require('./services/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  await server.register({
    plugin: albums,
    options: {
      service: {
        albumsService,
        songsService
      },
      validator: AlbumsValidator
    }
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator
    }
  })

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      console.log(response)
      newResponse.code(500)
      return newResponse
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
