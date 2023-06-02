const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().trim().required(),
  year: Joi.number().required(),
});

module.exports = {
  AlbumPayloadSchema,
};
