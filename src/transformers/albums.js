const transformer = {};
transformer.albumDetail = ({ id, name, year }) => ({ id, name, year });

module.exports = transformer;
