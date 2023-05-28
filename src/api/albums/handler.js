const autoBind = require('auto-bind');
const SongsService = require('../../services/postgres/SongsService');

class AlbumsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.validator.validateCreateAlbumPayload(request.payload);
    const albumId = await this.service.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: { albumId },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const songsService = new SongsService();

    const [album, songs] = await Promise.all([
      this.service.getAlbumById(id),
      songsService.getSongByAlbumId(id),
    ]);

    album.songs = songs;

    return {
      status: 'success',
      data: { album },
    };
  }

  async putAlbumByIdHandler(request) {
    this.validator.validateUpdateAlbumPayload(request.payload);
    const { id } = request.params;
    await this.service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
