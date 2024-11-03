class NotificationHandler {
  constructor(service) {
    this._notification_service = service.notification;

    this.getUserNotificationHandler = this.getUserNotificationHandler.bind(this);
    this.getNotificationHandler = this.getNotificationHandler.bind(this);
    this.getNotificationAsReadHandler = this.getNotificationAsReadHandler.bind(this);
  }

  async getUserNotificationHandler(request, h) {
    const { userId } = request.auth;

    const data = await this._notification_service.getUserNotificationList(userId);

    return h.response({
      error: false,
      data: {
        "notifications": data
      }
    }).code(200);
  }

  async getNotificationHandler(request, h) {
    const { notificationId } = request.params;

    const notificationData = await this._notification_service.getNotificationById(notificationId);

    return h.response({
      error: false,
      data: notificationData,
    }).code(200);
  }

  async getNotificationAsReadHandler(request, h) {
    const { notificationId } = request.params;

    await this._notification_service.markNotificationAsRead(notificationId);

    return h.response({
      error: false,
      message: "Pemberitahuan ditandai sebagai sudah dibaca",
    }).code(200);
  }
}

module.exports = NotificationHandler;