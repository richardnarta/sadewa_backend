class AuthHandler {
  constructor(service, validator) {
    this._authService = service.auth;
    this._userService = service.user;
    this._validator = validator;

    this.postAuthLoginHandler = this.postAuthLoginHandler.bind(this);
    this.postAuthForgetHandler = this.postAuthForgetHandler.bind(this);
    this.postAuthVerifyForgetHandler = this.postAuthVerifyForgetHandler.bind(this);
    this.getAuthLogoutHandler = this.getAuthLogoutHandler.bind(this);
  }

  async postAuthLoginHandler(request, h) {
    this._validator.validateLoginPayload(request.payload);

    const { username, email } = request.payload;

    let user = null;
    
    if (username === undefined) {
      user = await this._userService.getUserByEmail(email);
    } else {
      user = await this._userService.getUserByUsername(username);
    }
    
    const userData = await this._authService.addUserTokenToRedis(
      request.payload, user);

    return h.response({
      error: false,
      message: "Login berhasil",
      token: userData.token,
      userId: userData.id,
      type: userData.type
    }).code(200);
  }

  async postAuthForgetHandler(request, h) {
    this._validator.validateForgetPasswordPayload(request.payload);

    const userEmail = request.payload.user_email;

    const user = await this._userService.getUserByEmail(userEmail);

    await this._authService.sendUserEmailOTP(user.email, user.name);
    
    return h.response({
      error: false,
      message: "Kode OTP telah dikirimkan ke email anda",
    }).code(200);
  }

  async postAuthVerifyForgetHandler(request, h) {
    this._validator.validateVerificationForgetPasswordPayload(request.payload);

    const userEmail = request.payload.user_email;
    const OTP = request.payload.OTP;

    const token = await this._authService.verifyForgetPassword(userEmail, OTP);

    return h.response({
      error: false,
      message: "Pengguna telah terverifikasi",
      token: token,
    }).code(200);
  }

  async getAuthLogoutHandler(request, h) {
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split(' ')[1];

    await this._authService.removeUserTokenFromRedis(token);

    return h.response({
      error: false,
      message: "Logout berhasil",
    }).code(200);
  }
}

module.exports = AuthHandler;