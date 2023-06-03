const Joi = require('joi');

const ExportSongToPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportSongToPlaylistPayloadSchema;
