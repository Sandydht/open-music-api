const songList = (data) => ({
  id: data && data.id,
  title: data && data.title,
  performer: data && data.performer,
});

const songDetail = (data) => ({
  ...songList(data),
  year: data && data.year,
  genre: data && data.genre,
  duration: data && data.duration,
  albumId: data && data.albumId,
});

const transformer = {};
transformer.songList = (datas) => datas.map((data) => songList(data));
transformer.showSong = (data) => songDetail(data);

module.exports = transformer;
