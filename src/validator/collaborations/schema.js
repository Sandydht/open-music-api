const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().trim().required(),
  userId: Joi.string().trim().required(),
});

module.exports = {
  CollaborationPayloadSchema,
};
