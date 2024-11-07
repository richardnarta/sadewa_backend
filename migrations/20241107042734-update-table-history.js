'use strict';

function generateSensorInfo() {
  const random = Math.random();

  if (random < 0.7) {
    return 'Stabil';
  } else if (random < 0.85) {
    return 'Batas Maksimal';
  } else {
    return 'Batas Minimum';
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tblhistory', 'temperatureInfo', {
      type: Sequelize.ENUM('Batas Maksimal', 'Stabil', 'Batas Minimum'),
      allowNull: true,
    });

    await queryInterface.addColumn('tblhistory', 'phInfo', {
      type: Sequelize.ENUM('Batas Maksimal', 'Stabil', 'Batas Minimum'),
      allowNull: true,
    });

    await queryInterface.addColumn('tblhistory', 'salinityInfo', {
      type: Sequelize.ENUM('Batas Maksimal', 'Stabil', 'Batas Minimum'),
      allowNull: true,
    });

    await queryInterface.addColumn('tblhistory', 'turbidityInfo', {
      type: Sequelize.ENUM('Batas Maksimal', 'Stabil', 'Batas Minimum'),
      allowNull: true,
    });

    await queryInterface.bulkUpdate('tblhistory', { 
      temperatureInfo: generateSensorInfo(),
      phInfo: generateSensorInfo(),
      salinityInfo: generateSensorInfo(),
      turbidityInfo: generateSensorInfo(),
    }, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tblhistory', 'temperatureInfo');
    await queryInterface.removeColumn('tblhistory', 'phInfo');
    await queryInterface.removeColumn('tblhistory', 'salinityInfo');
    await queryInterface.removeColumn('tblhistory', 'turbidityInfo');
  }
};
