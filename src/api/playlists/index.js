const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    songsService,
    playlistSongsService,
    PlaylistsValidator,
    PlaylistSongsValidator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      playlistSongsService,
      PlaylistsValidator,
      PlaylistSongsValidator,
    );
    server.route(routes(playlistsHandler));
  },
};
