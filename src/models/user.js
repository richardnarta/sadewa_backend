'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
    }
  }
  User.init({
    email: DataTypes.TEXT,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    name: DataTypes.TEXT,
    type: DataTypes.ENUM('pengelola', 'admin'),
    verified: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'tbluser'
  });
  return User;
};