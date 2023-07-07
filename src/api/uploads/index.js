const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { albumsService, storageService, UploadsValidator }) => {
    const uploadsHandler = new UploadsHandler(albumsService, storageService, UploadsValidator);
    server.route(routes(uploadsHandler));
  },
};
