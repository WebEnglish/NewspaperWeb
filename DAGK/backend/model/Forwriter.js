var db = require('../utils/Database');

module.exports = {
  menu: () => {
    return db.load(`SELECT * FROM trangthai`);
  },

  category: () => {
    return db.load(`SELECT * from chuyenmuc AS cm WHERE cm.LoaiCM != 0`);
  },

  tag: () => {
    return db.load(`SELECT * from nhantag`);
  },

  addNews: entity => {
    return db.add(`baibao`,entity);
  }
}