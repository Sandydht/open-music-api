const autoBind = require('auto-bind');
const config = require('../../utils/config');

class UploadsHandler {
  constructor(albumsService, storageService, UploadsValidator) {
    this.albumsService = albumsService;
    this.storageService = storageService;
    this.uploadsValidator = UploadsValidator;
    autoBind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this.uploadsValidator.validateAlbumCoverPayload(cover.hapi.headers);
    const { id } = request.params;

    await this.albumsService.getAlbumById(id);

    const filename = await this.storageService.writeFile(cover, cover.hapi);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: `http://${config.app.host}:${config.app.port}/upload/images/albums-cover/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
