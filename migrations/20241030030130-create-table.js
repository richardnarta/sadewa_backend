'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbluser', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true,
      },
      email: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('pengelola', 'admin'),
        allowNull: false,
      },
    });

    await queryInterface.createTable('tblnotification', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        unique: true,
        allowNull: false,
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      level: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'tbluser',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.createTable('tblhistory', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        unique: true,
        allowNull: false,
      },
      temperature: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ph: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      salinity: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      turbidity: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tblhistory')
    await queryInterface.dropTable('tblnotification')
    await queryInterface.dropTable('tbluser');
  }
};