const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(
    playlistsService,
    songsService,
    playlistSongsService,
    playlistSongActivitiesService,
    PlaylistsValidator,
    PlaylistSongsValidator,
  ) {
    this.playlistsService = playlistsService;
    this.songsService = songsService;
    this.playlistSongsService = playlistSongsService;
    this.playlistSongActivitiesService = playlistSongActivitiesService;
    this.playlistsValidator = PlaylistsValidator;
    this.playlistSongsValidator = PlaylistSongsValidator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this.playlistsValidator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this.playlistsService.addPlaylist(request.payload, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.playlistsService.getPlaylists(credentialId);
    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistByOwner(id, credentialId);
    await this.playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this.playlistSongsValidator.validatePlaylistSongsPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await Promise.all([
      this.playlistSongsService.verifyPlaylistSongAccess(id, credentialId),
      this.songsService.getSongById(songId),
    ]);

    const playlistSongId = await this.playlistSongsService.addSongToPlaylist(id, request.payload);
    await this.playlistSongActivitiesService.addPlaylistSongActivity(id, songId, credentialId, 'add', new Date());
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
      data: { playlistSongId },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistSongsService.verifyPlaylistSongAccess(id, credentialId);

    const [playlist, songs] = await Promise.all([
      this.playlistsService.getPlaylistById(id),
      this.playlistSongsService.getPlaylistSongsByPlaylistId(id),
    ]);

    playlist.songs = songs;

    return {
      status: 'success',
      data: { playlist },
    };
  }

  async deletePlaylistSongHandler(request) {
    this.playlistSongsValidator.validatePlaylistSongsPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await Promise.all([
      this.playlistSongsService.verifyPlaylistSongAccess(id, credentialId),
      this.songsService.getSongById(songId),
    ]);

    await this.playlistSongsService.deletePlaylistSong(id, songId);
    await this.playlistSongActivitiesService.addPlaylistSongActivity(id, songId, credentialId, 'delete', new Date());

    return {
      status: 'success',
      message: 'Lagi berhasil dihapus dari playlist',
    };
  }

  async getPlaylistSongActivitiesHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistByOwner(id, credentialId);
    const activities = await this.playlistSongActivitiesService.getPlaylistSongActivities(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
