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
    const { data } = request.payload;
    this.uploadsValidator.validateAlbumCoverPayload(data.hapi.headers);
    const { id } = request.params;

    await this.albumsService.getAlbumById(id);

    const filename = await this.storageService.writeFile(data, data.hapi);
    const fileLocation = `http://${config.app.host}:${config.app.port}/upload/file/images/${filename}`;
    await this.albumsService.updateAlbumCover(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: { fileLocation },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
