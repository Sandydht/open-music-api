const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { albumsService, songsService, AlbumsValidator }) => {
    const albumsHandler = new AlbumsHandler(albumsService, songsService, AlbumsValidator);
    server.route(routes(albumsHandler));
  },
};
