const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { usersService, UsersValidator }) => {
    const usersHandler = new UsersHandler(usersService, UsersValidator);
    server.route(routes(usersHandler));
  },
};
