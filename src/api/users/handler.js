class UserHandler {
  constructor(service, validator) {
    this._userService = service.user;
    this._validator = validator;

    this.getUserListHandler = this.getUserListHandler.bind(this);
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserHandler = this.getUserHandler.bind(this);
    this.postUserVerificationHandler = this.postUserVerificationHandler.bind(this);
    this.patchUserPasswordHandler = this.patchUserPasswordHandler.bind(this);
    this.deleteUserHandler = this.deleteUserHandler.bind(this);
  }

  async getUserListHandler(request, h) {
    const users = await this._userService.getAllUsers(request.query);

    return h.response({
      error: false,
      data: {
        users: users
      }
    }).code(200);
  }

  async postUserHandler(request, h) {
    this._validator.validateRegisterPayload(request.payload);

    const payload = request.payload;

    const userId = await this._userService.createNewUser(payload);

    return h.response({
      error: false,
      message: "Kode OTP telah dikirimkan ke email anda",
      userId: userId
    }).code(200);
  }

  async getUserHandler(request, h) {
    const { userId } = request.params;

    const requester = request.auth;

    const user = await this._userService.getUserById(userId, requester);

    return h.response({
      error: false,
      data: {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "name": user.name,
        "type": user.type,
        "createdAt": user.createdAt,
        "verified": user.verified
      }
    }).code(200);
  }

  async postUserVerificationHandler(request, h) {
    this._validator.validateVerifyEmailPayload(request.payload);

    const { userId } = request.params;
    const { OTP } = request.payload;

    await this._userService.verifyUserEmail(userId, OTP);

    return h.response({
      error: false,
      message: "Email anda telah terverifikasi"
    }).code(200);
  }

  async patchUserPasswordHandler(request, h) {
    this._validator.validateChangePasswordPayload(request.payload);

    const { userId } = request.auth;
    const { new_password } = request.payload;

    await this._userService.changeUserPassword(userId, new_password);

    return h.response({
      error: false,
      message: "Password berhasil diubah"
    }).code(200);
  }

  async deleteUserHandler(request, h) {
    const { userId } = request.params;

    await this._userService.deleteUser(userId);

    return h.response({
      error: false,
      message: "Pengguna berhasil dihapus"
    }).code(200);
  }
}

module.exports = UserHandler;