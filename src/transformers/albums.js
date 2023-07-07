const albumDetail = (data) => ({
  id: data && data.id,
  name: data && data.name,
  year: data && data.year,
  coverUrl: data && data.cover ? data.cover : null,
});

const transformer = {};
transformer.showAlbum = (data) => albumDetail(data);

module.exports = transformer;
