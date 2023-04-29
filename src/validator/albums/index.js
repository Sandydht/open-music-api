const { CreateOrUpdateAlbumSchema } = require('~/validator/albums/schema');
const InvariantError = require('~/exceptions/InvariantError');

const AlbumsValidator = {
  validateCreateOrUpdateAlbumPayload: (payload) => {
    const validationResult = CreateOrUpdateAlbumSchema.validate(payload);
    if (validationResult?.error) throw new InvariantError(validationResult?.error?.message);
  },
};

module.exports = AlbumsValidator;
