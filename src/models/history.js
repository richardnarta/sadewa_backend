'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  History.init({
    timestamp: DataTypes.DATE,
    temperature: DataTypes.FLOAT,
    temperatureStatus: DataTypes.BOOLEAN,
    ph: DataTypes.FLOAT,
    phStatus: DataTypes.BOOLEAN,
    salinity: DataTypes.FLOAT,
    salinityStatus: DataTypes.BOOLEAN,
    turbidity: DataTypes.FLOAT,
    turbidityStatus: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'History',
    tableName: 'tblhistory'
  });
  return History;
};