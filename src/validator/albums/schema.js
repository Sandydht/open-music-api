const Joi = require('joi');

const CreateOrUpdateAlbumSchema = Joi.object({
  name: Joi.string().trim().required(),
  year: Joi.number().required(),
});

module.exports = {
  CreateOrUpdateAlbumSchema,
};
