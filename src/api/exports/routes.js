const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportSongToPlaylistHandler,
    options: {
      auth: 'musics_app',
    },
  },
];

module.exports = routes;
