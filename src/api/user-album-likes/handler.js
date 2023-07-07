const autoBind = require('auto-bind');

class UserAlbumLikesHandler {
  constructor(albumsService, usersService, userAlbumLikesService) {
    this.albumsService = albumsService;
    this.usersService = usersService;
    this.userAlbumLikesService = userAlbumLikesService;
    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await Promise.all([
      this.albumsService.getAlbumById(id),
      this.usersService.getUserById(credentialId),
      this.userAlbumLikesService.verifyUserAlbumLike(id, credentialId),
    ]);

    const userAlbumLikeId = await this.userAlbumLikesService.addUserAlbumLike(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai',
      data: { userAlbumLikeId },
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await Promise.all([
      this.albumsService.getAlbumById(id),
      this.usersService.getUserById(credentialId),
    ]);

    await this.userAlbumLikesService.deleteUserAlbumLike(id, credentialId);

    return {
      status: 'success',
      message: 'Album batal disukai',
    };
  }

  async getAlbumLikeHandler(request, h) {
    const { id } = request.params;

    await this.albumsService.getAlbumById(id);
    const result = await this.userAlbumLikesService.getUserAlbumLike(id);

    const response = h.response({
      status: 'success',
      data: { likes: result.likes },
    });
    if (result.source === 'cache') response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = UserAlbumLikesHandler;
