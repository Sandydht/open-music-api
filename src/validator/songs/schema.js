const Joi = require('joi');

const CreateOrUpdateSongSchema = Joi.object({
  title: Joi.string().trim().required(),
  year: Joi.number().required(),
  genre: Joi.string().trim().required(),
  performer: Joi.string().trim().required(),
  duration: Joi.number().required(),
  albumId: Joi.string().trim().allow(null, ''),
});

module.exports = {
  CreateOrUpdateSongSchema,
};
