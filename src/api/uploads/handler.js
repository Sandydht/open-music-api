const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, UploadsValidator) {
    this.storageService = storageService;
    this.uploadsValidator = UploadsValidator;
    autoBind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { data } = request.payload;
    this.uploadsValidator.validateImageHeaders(data.hapi.headers);

    const filename = await this.storageService.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
