const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this.validator.validateCreateSongPayload(request.payload);
    const songId = await this.service.addSong(request.payload);

    const response = await h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const songs = await this.service.getSongs(request.query);

    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);

    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler(request) {
    this.validator.validateUpdateSongPayload(request.payload);
    const { id } = request.params;
    await this.service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await Promise.all([
      this.service.deleteSongById(id),
      this.service.deleteSongFromPlaylist(id),
    ]);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
