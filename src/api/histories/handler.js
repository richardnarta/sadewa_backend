class HistoryHandler {
  constructor(service, validator) {
    this._historyService = service.history;
    this._validator = validator;

    this.getHistoryListHandler = this.getHistoryListHandler.bind(this);
  }

  async getHistoryListHandler(request, h) {
    this._validator.validateHistoryListQuery(request.query);

    const { page } = request.query;

    const data = await this._historyService.getHistoryList(page);

    return h.response({
      error: false,
      data: {
        "histories": data.data
      },
      page: data.page,
      total_pages: data.total_pages - 1
    }).code(200);
  }
}

module.exports = HistoryHandler;