var categoryModel = require('../model/DSBaiBao');

module.exports = (req, res, next) => {
  categoryModel.menu().then(rows => {     
    res.locals.ChuyenMuc = rows;
    next();
  })
}