var express = require('express');
var categoryModel = require('../model/DSBaiBao');
var router = express.Router();

router.get('/TrangChu', function (req, res) {
    categoryModel.all()
      .then(rows => {
        res.render('Home/Trangchu',{
          categories: rows
        });
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
});  





module.exports = router;