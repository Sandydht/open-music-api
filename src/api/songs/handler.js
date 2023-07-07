const autoBind = require('auto-bind');

class SongsHandler {
  constructor(songsService, SongsValidator) {
    this.songsService = songsService;
    this.songsValidator = SongsValidator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this.songsValidator.validateSongPayload(request.payload);
    const songId = await this.songsService.addSong(request.payload);

    const response = await h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const songs = await this.songsService.getSongs(request.query);

    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this.songsService.getSongById(id);

    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler(request) {
    this.songsValidator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this.songsService.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.songsService.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
