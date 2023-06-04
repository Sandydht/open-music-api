require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const config = require('./utils/config');

// Exceptions
const ClientError = require('./exceptions/ClientError');

// Albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// Playlist songs
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistSongs');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Playlist song activities
const PlaylistSongActivitiesService = require('./services/postgres/PlaylistSongActivitiesService');

// Exports
// eslint-disable-next-line no-underscore-dangle
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// User album likes
const userAlbumLikes = require('./api/user-album-likes');
const UserAlbumLikesService = require('./services/postgres/UserAlbumLikesService');

// Cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const collaborationsService = new CollaborationsService();
  const cacheService = new CacheService();

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistSongsService = new PlaylistSongsService(playlistsService, collaborationsService);
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register eksternal plugins
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Authentication JWT strategy
  server.auth.strategy('musics_app', 'jwt', {
    keys: config.app.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.app.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Register internal plugins
  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        songsService,
        AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        songsService,
        SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        usersService,
        UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        TokenManager,
        AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        playlistSongsService,
        playlistSongActivitiesService,
        PlaylistsValidator,
        PlaylistSongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        playlistsService,
        usersService,
        collaborationsService,
        CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        playlistsService,
        ProducerService,
        ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        albumsService,
        storageService,
        UploadsValidator,
      },
    },
    {
      plugin: userAlbumLikes,
      options: {
        albumsService,
        usersService,
        userAlbumLikesService,
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
