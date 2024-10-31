class HomeHandler {
  constructor() {
    this.getHomeHandler = this.getHomeHandler.bind(this);
  }

  async getHomeHandler(request, h) {
    return h.response({
      error: false,
      title: "API Tambak Udang Sadewa Farm",
      version: "1.0",
      author: "Kelompok 1 PTI RB Ganjil 2024/2025"
    }).code(200);
  }
}

module.exports = HomeHandler;