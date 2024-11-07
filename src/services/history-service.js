const { fn, Op, col } = require('sequelize');
const { History } = require('../models');

class HistoryService {
  async getHistoryList(page) {
    if (page === undefined) {
      page = 0;
    }

    page = Number(page).toFixed(0);

    const limit = 6;

    const count = await History.count({
      group: [fn('DATE', col('timestamp'))],
    });

    const pagedHistory = await History.findAll({
      attributes: [
        [fn('DATE', col('timestamp')), 'date'],
      ],
      group: [fn('DATE', col('timestamp'))],
      order: [[fn('DATE', col('timestamp')), 'DESC']],
      limit: limit,
      offset: limit * page
    });

    const totalPages = Math.ceil(count.length / limit);

    const historyDate = [];

    for (const history of pagedHistory) {
      historyDate.push(history.dataValues.date);
    }

    const data = [];

    for (const date of historyDate) {
      data.push({
        date: date,
        log: await this.getHistoryDetail(date)
      });
    }

    return {
      page: Number(page),
      total_pages: totalPages,
      data: data
    };
  }

  async getHistoryDetail(date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 59);

    let data =  await History.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['timestamp', 'ASC']],
    });

    data = data.map(history => history.dataValues)

    return data.map(history => {
      return {
        time: String(history.timestamp).slice(16, 21),
        temperature: history.temperature,
        temperature_status: history.temperatureStatus,
        temperature_info: history.temperatureInfo,
        ph: history.ph,
        ph_status: history.phStatus,
        ph_info: history.phInfo,
        salinity: history.salinity,
        salinity_status: history.salinityStatus,
        salinity_info: history.salinityInfo,
        turbidity: history.turbidity,
        turbidity_status: history.turbidityStatus,
        turbidity_info: history.turbidityInfo,
      }
    });
  }
}

module.exports = HistoryService;