const ExportSongToPlaylistPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
  validateExportSongToPlaylistPayload: (payload) => {
    const validationResult = ExportSongToPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = ExportsValidator;
