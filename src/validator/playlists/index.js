const { AddPlaylistSchema, AddSongToPlaylistSchema, DeleteSongFromPlaylist } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validateAddPlaylistPayload: (payload) => {
    const validationResult = AddPlaylistSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateAddSongToPlaylistPayload: (payload) => {
    const validationResult = AddSongToPlaylistSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateDeleteSongFromPlaylistPayload: (payload) => {
    const validationResult = DeleteSongFromPlaylist.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = PlaylistsValidator;
