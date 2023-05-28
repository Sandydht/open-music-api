const Joi = require('joi');

const AddPlaylistSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const AddSongToPlaylistSchema = Joi.object({
  songId: Joi.string().trim().required(),
});

const DeleteSongFromPlaylist = Joi.object({
  songId: Joi.string().trim().required(),
});

module.exports = {
  AddPlaylistSchema,
  AddSongToPlaylistSchema,
  DeleteSongFromPlaylist,
};
