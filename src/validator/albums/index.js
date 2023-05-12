const { CreateAlbumPayloadSchema, UpdateAlbumPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validateCreateAlbumPayload: (payload) => {
    const validationResult = CreateAlbumPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateUpdateAlbumPayload: (payload) => {
    const validationResult = UpdateAlbumPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = AlbumsValidator;
