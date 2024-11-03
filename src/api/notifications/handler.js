class NotificationHandler {
  constructor(service) {
    this._notificationService = service.notification;

    this.getUserNotificationHandler = this.getUserNotificationHandler.bind(this);
    this.getNotificationHandler = this.getNotificationHandler.bind(this);
    this.getNotificationAsReadHandler = this.getNotificationAsReadHandler.bind(this);
  }

  async getUserNotificationHandler(request, h) {
    const { userId } = request.auth;

    const data = await this._notificationService.getUserNotificationList(userId);

    return h.response({
      error: false,
      data: {
        "notifications": data
      }
    }).code(200);
  }

  async getNotificationHandler(request, h) {
    const { notificationId } = request.params;

    const notificationData = await this._notificationService.getNotificationById(notificationId);

    return h.response({
      error: false,
      data: notificationData,
    }).code(200);
  }

  async getNotificationAsReadHandler(request, h) {
    const { notificationId } = request.params;

    await this._notificationService.markNotificationAsRead(notificationId);

    return h.response({
      error: false,
      message: "Pemberitahuan ditandai sebagai sudah dibaca",
    }).code(200);
  }
}

module.exports = NotificationHandler;