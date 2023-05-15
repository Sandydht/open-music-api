const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'musics_app',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'musics_app',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'musics_app',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylist,
    options: {
      auth: 'musics_app',
    },
  },
];

module.exports = routes;
