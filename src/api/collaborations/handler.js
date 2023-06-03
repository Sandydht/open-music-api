const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(playlistsService, usersService, collaborationsService, CollaborationsValidator) {
    this.playlistsService = playlistsService;
    this.usersService = usersService;
    this.collaborationsService = collaborationsService;
    this.CollaborationsValidator = CollaborationsValidator;
    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this.CollaborationsValidator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await Promise.all([
      this.playlistsService.verifyPlaylistByOwner(playlistId, credentialId),
      this.usersService.getUserById(userId),
    ]);

    const collaborationId = await this.collaborationsService.addCollaborator(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Kolaborator berhasil ditambahkan',
      data: { collaborationId },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this.CollaborationsValidator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await Promise.all([
      this.playlistsService.verifyPlaylistByOwner(playlistId, credentialId),
      this.usersService.getUserById(userId),
    ]);

    await this.collaborationsService.deleteCollaborator(request.payload);

    return {
      status: 'success',
      message: 'Kolaborator berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
