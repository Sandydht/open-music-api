const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, songsService, AlbumsValidator) {
    this.albumsService = albumsService;
    this.songsService = songsService;
    this.albumsValidator = AlbumsValidator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.albumsValidator.validateAlbumPayload(request.payload);
    const albumId = await this.albumsService.addAlbum(request.payload);

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
    const [album, songs] = await Promise.all([
      this.albumsService.getAlbumById(id),
      this.songsService.getSongByAlbumId(id),
    ]);
    album.songs = songs;

    return {
      status: 'success',
      data: { album },
    };
  }

  async putAlbumByIdHandler(request) {
    this.albumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this.albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this.albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
