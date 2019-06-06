var express = require('express');
var writerModal = require('../model/Forwriter');
var router = express.Router();
var alert = require('alert-node');;

router.get('/', (req, res, next) => {
  Promise.all([
    writerModal.category(),
    writerModal.tag()
  ]).then(([row, row1, row2]) => {
    res.render('writer/writing.hbs', {
      cat: row,
      tag: row1,
      layout: '../writer/main'
    });
  });
})


router.get('/:idTT', (req, res, next) => {
  var id = req.params.idTT;

  // var page = req.query.page || 1;
  // // console.log("vô nè");
  // if (page < 1) page = 1;

  // var limit = 6;
  // var offset = (page - 1) * limit;
  Promise.all([
    writerModal.category(),
    writerModal.tag()
  ]).then(([row, row1, row2]) => {

    // console.log("tag nè: " + JSON.stringify(valueTag))
    for (const c of res.locals.Action) {
      if (c.idTrangThai === +id) {
        c.isActive = true;
      }
    }

    // var total = count_rows[0].total;
    // var nPages = Math.floor(total / limit);
    // if (total % limit > 0) nPages++;
    // var pages = [];
    // for (i = 1; i <= nPages; i++) {
    //   var obj = { value: i, active: i === +page };
    //   pages.push(obj);
    // }

    if (id == 5) {
      res.render('writer/writing.hbs', {
        cat: row,
        tag: row1,
        layout: '../writer/main',
      })
    }
    else {
      res.render('writer/dsbaiviet', {
        layout: '../writer/main'
      })
    }
  }).catch(next);
});

router.post('/', (req, res, next) => {
  var datetime = new Date();
  var entity = {
    TenBaiBao: req.body.txtTitle,
    NoiDungTomTat: req.body.summary,
    NoiDung: req.body.editor,
    NgayDang: datetime,
    TacGia: 4,
    TrangThai: 3,
    AnhDaiDien: req.body.img,
    premium: 1,
    luotXem: 0,
    ChuyenMuc: req.body.optTenCM
  }

  var entity2 = {
    idTag: req.body.choose
  }

  Promise.all([
    writerModal.category(),
    writerModal.tag(),
    writerModal.addNews(entity)
  ]).
    then(([row, row1, row2]) => {
      console.log(entity2);
      res.render('writer/writing.hbs', {
        cat: row,
        tag: row1,
        layout: '../writer/main'
      })
        .catch(err => {
          console.log(err);
        })

    })


})

module.exports = router;