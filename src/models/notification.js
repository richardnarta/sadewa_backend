'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Notification.init({
    timestamp: DataTypes.DATE,
    read: DataTypes.BOOLEAN,
    level: DataTypes.ENUM('low', 'medium', 'high'),
    title: DataTypes.TEXT,
    body: DataTypes.TEXT,
    userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'tblnotification'
  });
  return Notification;
};