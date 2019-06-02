var express = require('express');
var categoryModel = require('../model/DSBaiBao');
var router = express.Router();

router.get('/home', function (req, res,next) {
  Promise.all([
    categoryModel.all(),
    categoryModel.t10mostview(),
    categoryModel.newest()
  ]).then(([row, rows, rows1]) => {
    res.render('home', {
      carousels: row,
      top10: rows,
      newest: rows1
    });
  }).catch(next);
});

router.get('/', function (req, res,next) {
  Promise.all([
    categoryModel.all(),
    categoryModel.t10mostview(),
    categoryModel.newest()
  ]).then(([row, rows, rows1]) => {

    // for (const c of res.obj.carousels) {
    //     c.isActive = true;
    // }

    res.render('home', {
      carousels: row,
      top10: rows,
      newest: rows1
    });
  }).catch(next);
});

router.get('/:idCM',   (req, res, next) => {
  var id = req.params.idCM;

  var page = req.query.page || 1;
  // console.log("vô nè");
  if (page < 1) page = 1;

  var limit = 6;
  var offset = (page - 1) * limit;
  Promise.all([
    categoryModel.allByCat(id),
    categoryModel.pageByCat(id, limit, offset),
    categoryModel.countByCat(id),
    categoryModel.tag(id)
  ]).then(([cate, rows, count_rows, valueTag]) => {

    // console.log("tag nè: " + JSON.stringify(valueTag))
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
      cat: cate,
      bycat: rows,
      pages,
      tag: valueTag
    });

  }).catch(next);
});

// router.get('/0', (req, res) => {
//   categoryModel.newest()
//     .then(rows => {
//       // console.log(res.locals.lcCategories);

//       res.render('home', {
//         newest: rows
//       });
//     }).catch(err => {
//       console.log(err);
//       res.end('error occured.')
//     });
// });



module.exports = router;