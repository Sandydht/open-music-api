const { CreateOrUpdateSongSchema } = require('~/validator/songs/schema');
const InvariantError = require('~/exceptions/InvariantError');

const SongsValidator = {
  validateCreateOrUpdateSongPayload: (payload) => {
    const validationResult = CreateOrUpdateSongSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult?.error?.message);
  },
};

module.exports = SongsValidator;
