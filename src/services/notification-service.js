const { Notification } = require('../models');

class NotificationService {
  async getUserNotificationList(userId) {
    return await Notification.findAll({
      attributes: ['id', 'timestamp', 'read', 'level', 'title'],
      where : {
        userId: userId
      }
    });
  }

  async getNotificationById(notificationId) {
    let notification = await Notification.findByPk(notificationId);

    if (notification == null) {
      throw new NotFoundError('Data pemberitahuan tidak ditemukan');
    }

    notification = notification.dataValues;

    return {
      id: notification.id,
      timestamp: notification.timestamp,
      title: notification.title,
      body: notification.body,
      level: notification.level,
      read: notification.read,
    }
  }

  async markNotificationAsRead(notificationId) {
    const notification = await Notification.findByPk(notificationId);

    if (notification == null) {
      throw new NotFoundError('Data pemberitahuan tidak ditemukan');
    }

    await Notification.update({ read: True }, {
      where: {
        id: notificationId
      }
    });
  }
}

module.exports = NotificationService;