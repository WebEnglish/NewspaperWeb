var db = require('../utils/Database');

module.exports = {
  all: () => {
    return db.load('select * from baibao');
  },

  // allWithDetails: () => {
  //   return db.load(
  //     `
  //     select c.CatID, c.CatName, count(p.ProID) as num_of_products
  //     from categories c left join products p on c.CatID = p.CatID
  //     group by c.CatID, c.CatName
  //   `
  //   );
  // },


  menu: ()=> {
    return db.load(`select * from chuyenmuc where LoaiCM = 0`);
  }
}

