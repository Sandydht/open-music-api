const autoBind = require('auto-bind');

class UsersHandler {
  constructor(usersService, UsersValidator) {
    this.usersService = usersService;
    this.usersValidator = UsersValidator;
    autoBind(this);
  }

  async postUserHandler(request, h) {
    this.usersValidator.validateUserPayload(request.payload);
    const userId = await this.usersService.addUser(request.payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { userId },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this.usersService.getUserById(id);

    return {
      status: 'success',
      data: { user },
    };
  }
}

module.exports = UsersHandler;
