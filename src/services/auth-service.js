const sendEmail = require('../utils/email');
const { generateForgetPasswordOTPHTML } = require('../utils/otp-html');
const { generateOTPCode, verifyPassword } = require('../utils/auth');
const { generateToken, verifyToken } = require('../utils/jwt');
const { storeToken, removeToken, storeOTP, getToken } = require('../utils/redis');
const UserService = require('../services/user-service');
const ClientError = require('../exceptions/client-error');

class AuthService {
  constructor (userService) {
    this._userService = userService;
  }

  async sendUserEmailOTP(userEmail, userName) {
    const OTP = generateOTPCode();
    const recipientName = userName;
    const subject = '[Tambak Sadewa Farm] Lupa Password';
    const content = generateForgetPasswordOTPHTML(recipientName, OTP);

    await storeOTP(`${userEmail}:otp`, OTP);
    await sendEmail(userEmail, recipientName, subject, content);
  }

  async addUserTokenToRedis(payload, user) {
    const password = payload.password;

    delete payload.password;
    delete payload.notification_token;
    payload.id = user.id;
    payload.type = user.type;
    payload.email = user.email;
    payload.notification = payload.notification_token;

    const token = generateToken(payload);

    const hashedPassword = user.password;

    const passwordIsTrue = await verifyPassword(password, hashedPassword);

    if (!passwordIsTrue) {
      throw new ClientError('Password tidak sesuai');
    }
    
    await storeToken(`${user.id}:token`, token);

    return token;
  }

  async verifyForgetPassword(userEmail, OTP) {
    const storedOTP = await getToken(`${userEmail}:otp`);

    if (storedOTP === null) {
      throw new ClientError('Kode OTP telah expired');
    }

    if (storedOTP != OTP) {
      throw new ClientError('Kode OTP tidak sesuai');
    }

    const user = await this._userService.getUserByEmail(userEmail);
    const payload = {
      id: user.id,
      type: user.type,
      email: user.email,
      username: user.username
    }

    const token = generateToken(payload);

    await storeToken(`${user.id}:token`, token);

    await removeToken(`${userEmail}:otp`);

    return token;
  }

  async removeUserTokenFromRedis(token) {
    const user = await verifyToken(token);

    await removeToken(`${user.id}:token`);
  }
}

module.exports = AuthService;