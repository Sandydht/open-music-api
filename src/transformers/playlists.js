const songsTransform = require('./songs');

const listPlaylist = (data) => ({
  id: data && data.id,
  name: data && data.name,
  username: data && data.username,
});

const playlistDetailWithSongs = (data) => ({
  ...listPlaylist(data),
  songs: data && data.songs && Array.isArray(data.songs) && data.songs.length > 0
    ? songsTransform.songList(data.songs) : [],
});

const transformer = {};
transformer.playlistList = (datas) => datas.map((data) => listPlaylist(data));
transformer.showPlaylistWithSongs = (data) => playlistDetailWithSongs(data);

module.exports = transformer;
