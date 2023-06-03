const listPlaylist = (data) => ({
  id: data && data.id,
  name: data && data.name,
  username: data && data.username,
});

const playlistDetail = (data) => ({
  ...listPlaylist(data),
});

const transformer = {};
transformer.playlistList = (datas) => datas.map((data) => listPlaylist(data));
transformer.showPlaylist = (data) => playlistDetail(data);

module.exports = transformer;
