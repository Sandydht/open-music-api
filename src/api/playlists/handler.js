const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this.validator.validateAddPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this.service.addPlaylist({ ...request.payload, owner: credentialId });
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
    const playlists = await this.service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyPlaylistByOwner(id, credentialId);
    await this.service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylist(request, h) {
    this.validator.validateAddSongToPlaylistPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this.service.verifyPlaylistByOwner(playlistId, credentialId);
    await this.service.verifySongById(songId);
    const playlistSongId = await this.service.addSongToPlaylists({ playlistId, songId });

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke playlist',
      data: { playlistSongId },
    });
    response.code(201);
    return response;
  }
}

module.exports = PlaylistsHandler;
