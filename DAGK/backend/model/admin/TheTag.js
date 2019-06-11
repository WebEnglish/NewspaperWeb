var db = require('../../utils/Database');

module.exports = {
  all: () => {
    return db.load('select * from nhantag where Xoa = 0');
  },

  add: entity => {
    return db.add('nhantag', entity);
  },
}