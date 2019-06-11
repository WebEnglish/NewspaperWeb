var categoryModel = require('../model/DSBaiBao');

module.exports = (req, res, next) => {
    categoryModel.menu().then(rows => {     
    res.locals.ChuyenMuc = rows;
    next();
  })
}

// module.exports = (req, res, next) => {
//   Promise.all([
//     categoryModel.menu(),
//     categoryModel.dropdown()
//   ])
//   .then(([rows, row]) => {     
//     res.locals.ChuyenMuc = rows;
//     res.locals.dropdowns = row;
//     next();
//   })
// }