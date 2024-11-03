'use strict';

const { nanoid } = require('nanoid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbluser', [
      {
        id: nanoid(16),
        email: 'root@gmail.com',
        password: '$2a$10$3D3/fv1EyrS5y7VQYEGL8u3CbTKm1swb4gWzJEQWqgkN3j55pB2gy',
        username: 'admin',
        name: 'Admin Tambak Udang Sadewa Farm',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'admin',
        verified: true
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbluser');
  }
};
