const UserAlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'user-album-likes',
  version: '1.0.0',
  register: async (server, { albumsService, usersService, userAlbumLikesService }) => {
    const userAlbumLikesHandler = new UserAlbumLikesHandler(
      albumsService,
      usersService,
      userAlbumLikesService,
    );
    server.route(routes(userAlbumLikesHandler));
  },
};
