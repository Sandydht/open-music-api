const InvariantError = require('../../exceptions/InvariantError');
const { AlbumCoverPayloadSchema } = require('./schema');

const UploadsValidator = {
  validateAlbumCoverPayload: (headers) => {
    const validationResult = AlbumCoverPayloadSchema.validate(headers);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = UploadsValidator;
