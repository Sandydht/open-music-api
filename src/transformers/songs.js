const transformer = {};
transformer.songList = ({ id, title, performer }) => ({
  id, title, performer,
});
transformer.songDetail = ({ id, title, year, performer, genre, duration, albumId }) => ({
  id, title, year, performer, genre, duration, albumId,
});

module.exports = transformer;
