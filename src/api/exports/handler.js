const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(playlistsService, ProducerService, ExportsValidator) {
    this.playlistsService = playlistsService;
    this.producerService = ProducerService;
    this.exportsValidator = ExportsValidator;
    autoBind(this);
  }

  async postExportSongToPlaylistHandler(request, h) {
    this.exportsValidator.validateExportSongToPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { targetEmail } = request.payload;

    await this.playlistsService.verifyPlaylistByOwner(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this.producerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
