const songsTransform = require('./songs');

const albumDetail = (data) => ({
  id: data && data.id,
  name: data && data.name,
  year: data && data.year,
});

const albumDetailWithSongs = (data) => ({
  ...albumDetail(data),
  songs: data && data.songs && Array.isArray(data.songs) && data.songs.length > 0
    ? data.songs.map((song) => songsTransform.showSong(song)) : [],
});

const transformer = {};
transformer.showAlbumWithSongs = (data) => albumDetailWithSongs(data);

module.exports = transformer;
