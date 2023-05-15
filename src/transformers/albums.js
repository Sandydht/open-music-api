const transformer = {};
transformer.albumDetail = ({
  id, name, year, songs,
}) => ({
  id, name, year, songs: songs.map((song) => transformer.songDetail(song)),
});

transformer.songDetail = ({
  id, title, performer,
}) => ({
  id, title, performer,
});

module.exports = transformer;
