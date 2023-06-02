const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().trim().required(),
  year: Joi.number().required(),
  genre: Joi.string().trim().required(),
  performer: Joi.string().trim().required(),
  duration: Joi.number().allow(null, '', 0),
  albumId: Joi.string().trim().allow(null, ''),
});

module.exports = {
  SongPayloadSchema,
};
