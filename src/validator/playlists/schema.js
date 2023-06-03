const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().trim().required(),
});

module.exports = {
  PlaylistPayloadSchema,
};
