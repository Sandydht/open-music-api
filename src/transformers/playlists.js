const transformer = {};
transformer.playlistList = ({ id, name, username }) => ({ id, name, username });

module.exports = transformer;
