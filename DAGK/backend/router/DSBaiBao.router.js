var express = require('express');
var categoryModel = require('../model/DSBaiBao');
var router = express.Router();

router.get('/home', function (req, res) {
  categoryModel.all().then(rows => {
    res.render('home', {
      baibao: rows
    });
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
});

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  var limit = 6;
  var offset = (page - 1) * limit;

  Promise.all([
    categoryModel.pageByCat(id, limit, offset),
    categoryModel.countByCat(id),
  ]).then(([rows, count_rows]) => {

    for (const c of res.locals.ChuyenMuc) {
      if (c.idChuyenMuc === +id) {
        c.isActive = true;
      }
    }

    var total = count_rows[0].total;
    var nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i = 1; i <= nPages; i++) {
      var obj = { value: i, active: i === +page };
      pages.push(obj);
    }

    res.render('dsbaibao-theo-chuyenmuc', {
      //tagbycat: rows,
      bycat: rows,
      pages
    });

  }).catch(next);
})

// router.get('/:id', (req, res, next) => {
//   var id = req.params.id;
//   categoryModel.tagByCat(id)
//     .then(rows => {
//       // console.log(res.locals.lcCategories);

//       res.render('dsbaibao-theo-chuyenmuc', {
//         tagbycat: rows
//       });
//     }).catch(next);
// })

module.exports = router;