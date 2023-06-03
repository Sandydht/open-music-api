const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { songsService, SongsValidator }) => {
    const songsHandler = new SongsHandler(songsService, SongsValidator);
    server.route(routes(songsHandler));
  },
};
