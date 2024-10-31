const { User } = require('../models');
const NotFoundError = require('../exceptions/not-found-error');
const ClientError = require('../exceptions/client-error')

class UserService {
  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }

  async getUserById(id) {
    const user = await User.findByPk(id);

    if (user == null) {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    return user;
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

    return user[0].dataValues;
  }
}

module.exports = UserService;
