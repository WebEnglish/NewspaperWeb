var writerModel = require('../model/Forwriter');

module.exports = (req, res, next) => {
    writerModel.menu()
  .then(rows => {     
    res.locals.Action = rows;
    next();
  })
}
