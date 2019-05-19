var express = require('express');
var categoryModel = require('../model/DSBaiBao');
var router = express.Router();

router.get('/TrangChu', function (req, res) {
    categoryModel.all().then(rows => {
        res.render('Home/Trangchu',{
          categories: rows
        });
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
}); 


// // router.get('/a', (req, res) => {

// //   categoryModel.menu().then(rows => {
// //       res.render('a');
// //        //console.log(res.locals.lcCategories);

// //       // for (const c of res.locals.lcCategories) {
// //       //   if (c.CatID === +id) {
// //       //     c.isActive = true;
// //       //   }
// //       // }

// //       // res.render('', {
// //       //   products: rows
     
// //     }).catch(err => {
// //       console.log(err);
// //       res.end('error occured.')
// //     });
// })


module.exports = router;