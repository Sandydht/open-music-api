const { CreataSongPayloadSchema, UpdateSongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
  validateCreateSongPayload: (payload) => {
    const validationResult = CreataSongPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateUpdateSongPayload: (payload) => {
    const validationResult = UpdateSongPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = SongsValidator;
