const { User } = require('../models');
const { nanoid } = require('nanoid');
const sendEmail = require('../utils/email');
const { generateEmailVerificationOTPHTML } = require('../utils/otp-html');
const { generateOTPCode, hashPassword } = require('../utils/auth');
const { removeToken, storeOTP, getToken } = require('../utils/redis');
const NotFoundError = require('../exceptions/not-found-error');
const ClientError = require('../exceptions/client-error');

class UserService {
  async getAllUsers(query) {
    const type = query.type === 'pengelola' ? { 
      type: 'pengelola',
      verified: true 
    } : { verified: true };

    return await User.findAll({
      attributes: ['id', 'username', 'type'],
      where: type
    });
  }

  async getUserById(userId, requester) {
    if (requester.userType !== 'admin' && userId != requester.userId) {
      throw new ClientError('Forbidden', 403);
    }

    let user = await User.findByPk(userId);

    if (user == null) {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    if (!user.dataValues.verified) {
      throw new ClientError('Pengguna belum terverifikasi');
    }

    user = user.dataValues;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      type: user.type,
      createdAt: user.createdAt,
      verified: user.verified
    }
  }

  async getUserByUsername(username) {
    const user = await User.findAll({
      where: {
        username: username
      },
    });

    if (user.length === 0) {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    if (!user[0].dataValues.verified) {
      throw new ClientError('Pengguna belum terverifikasi');
    }

    return user[0].dataValues;
  }

  async getUserByEmail(email) {
    const user = await User.findAll({
      where: {
        email: email
      },
    });

    if (user.length === 0) {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    if (!user[0].dataValues.verified) {
      throw new ClientError('Pengguna belum terverifikasi');
    }

    return user[0].dataValues;
  }

  async sendUserEmailOTP(userEmail, userName) {
    const OTP = generateOTPCode()
    const recipientName = userName;
    const subject = '[Tambak Sadewa Farm] Aktifasi Akun';
    const content = generateEmailVerificationOTPHTML(recipientName, OTP);

    await storeOTP(`${userEmail}:otp`, OTP);
    await sendEmail(userEmail, recipientName, subject, content);
  }

  async createNewUser(payload) {
    const {
      user_email,
      user_username,
      user_password,
      user_name,
      user_type
    } = payload

    const users = await User.findAll({
      attributes: ['email', 'username']
    });

    const registeredEmail = users.map(user => user.dataValues.email);

    if (registeredEmail.includes(user_email)) {
      throw new ClientError('Email telah terdaftar');
    }

    const registeredUsername = users.map(user => user.dataValues.username);

    if (registeredUsername.includes(user_username)) {
      throw new ClientError('Username telah digunakan');
    }

    const newUser = await User.create({
      id: nanoid(16),
      email: user_email,
      password: await hashPassword(user_password),
      username: user_username,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: user_name,
      type: user_type
    });

    await this.sendUserEmailOTP(user_email, user_name);

    return newUser.id;
  }

  async verifyUserEmail(userId, OTP) {
    const user = await User.findByPk(userId);

    const storedOTP = await getToken(`${user.dataValues.email}:otp`);

    if (storedOTP === null) {
      throw new ClientError('Kode OTP telah expired');
    }

    if (storedOTP != OTP) {
      throw new ClientError('Kode OTP tidak sesuai');
    }

    await User.update({ verified: true }, {
      where: {
        id: userId
      }
    });
  }

  async changeUserPassword(userId, newPassword) {
    const hashedPassword = await hashPassword(newPassword);

    const user = await User.findByPk(userId);

    if (user == null) {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    if (!user.dataValues.verified) {
      throw new ClientError('Pengguna belum terverifikasi');
    }

    await User.update({ password: hashedPassword }, {
      where: {
        id: userId
      }
    });
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);

    if (user == null) {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    if (!user.dataValues.verified) {
      throw new ClientError('Pengguna belum terverifikasi');
    }

    await User.destroy({
      where: {
        id: userId
      }
    });
  }
}

module.exports = UserService;
