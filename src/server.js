require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt')
const ClientError = require('./exceptions/ClientError');

//albums
const AlbumsService = require('./services/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const albums = require('./api/albums');

// songs
const songs = require('./api/songs');
const { SongsService } = require('./services/SongsService');
const SongsValidator = require('./validator/songs');

//users
const users = require('./api/users');
const UsersService = require('./services/UsersService');
const { UsersValidator } = require('./validator/users');

//auth
const auth = require('./api/auth');
const AuthService = require('./services/AuthService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/auth');

//playlists
const PlaylistsService = require('./services/PlaylistsService');
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');




const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authService = new AuthService()
  const playlistsService = new PlaylistsService
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

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

  await server.register({
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator
    }
  })

  await server.register({
    plugin: auth,
    options: {
      authService: authService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator
    }
  })

  await server.register({
    plugin: playlists,
    options: {
      playlistsService,
      songsService,
      validator: PlaylistsValidator
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
