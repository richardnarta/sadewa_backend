'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbluser', 'verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.bulkUpdate('tbluser', { verified: true }, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbluser', 'verified');
  }
};
