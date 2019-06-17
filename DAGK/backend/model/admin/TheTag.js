var db = require('../../utils/Database');

module.exports = {
  all: () => {
    return db.load('select * from nhantag where Xoa = 0');
  },

  add: entity => {
    return db.add('nhantag', entity);
  },

  GetTagById : id => {
    return db.load(`select * from nhantag where idTag = '${id}' and Xoa = 0`);
  },
  update: entity => {
    return db.update('nhantag', 'idTag', entity);
  },

}