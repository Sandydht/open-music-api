const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService, UploadsValidator }) => {
    const uploadsHandler = new UploadsHandler(storageService, UploadsValidator);
    server.route(routes(uploadsHandler));
  },
};
