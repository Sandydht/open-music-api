const Joi = require('joi');

const CreateAlbumPayloadSchema = Joi.object({
  name: Joi.string().trim().required(),
  year: Joi.number().required(),
});

const UpdateAlbumPayloadSchema = Joi.object({
  name: Joi.string().trim().required(),
  year: Joi.number().required(),
});

module.exports = {
  CreateAlbumPayloadSchema,
  UpdateAlbumPayloadSchema,
};
