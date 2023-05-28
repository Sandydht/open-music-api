const albumDetail = (data) => ({
  id: data && data.id,
  name: data && data.name,
  year: data && data.year,
});

const transformer = {};
transformer.showAlbum = (data) => albumDetail(data);

module.exports = transformer;
