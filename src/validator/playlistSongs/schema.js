const Joi = require('joi');

const PlaylistSongsPayloadSchema = Joi.object({
  songId: Joi.string().trim().required(),
});

module.exports = {
  PlaylistSongsPayloadSchema,
};
