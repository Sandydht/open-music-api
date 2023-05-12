require('module-alias/register');
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('~/exceptions/ClientError');

// Albums
const albums = require('~/api/albums');
const AlbumsService = require('~/services/postgres/AlbumsService');
const AlbumsValidator = require('~/validator/albums');

// Songs
const songs = require('~/api/songs');
const SongsService = require('~/services/postgres/SongsService');
const SongsValidator = require('~/validator/songs');

// Users
const users = require('~/api/users');
const UsersService = require('~/services/postgres/UsersService');
const UsersValidator = require('~/validator/users');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register plugins
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  // Error handler
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) return h.continue;

      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server running on ${server.info.uri}`);
};

init();

