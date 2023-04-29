const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateCreateOrUpdateSongPayload(request.payload);
    const { title, year, genre, performer, duration } = request.payload;
    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
    });

    const response = await h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(_, h) {
    const songs = await this._service.getSongs();

    const response = await h.response({
      status: 'success',
      data: { songs },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = await h.response({
      status: 'success',
      data: { song },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateCreateOrUpdateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, genre, performer, duration } = request.payload;
    await this._service.editSongById(id, { title, year, genre, performer, duration });

    const response = await h.response({
      status: 'success',
      message: 'Song berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    const response = await h.response({
      status: 'success',
      message: 'Song berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
