var express = require('express');
var writerModal = require('../model/Forwriter');
var router = express.Router();
var moment = require('moment');
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
  var page = req.query.page || 1;
  var flat = false;
  if (page < 1) page = 1;

  var limit = 6;
  var offset = (page - 1) * limit;
  Promise.all([
    writerModal.status(id),
    writerModal.baiviet(id, limit, offset),
    writerModal.countByCat(id)
  ])

    .then(([row1, row2, count_rows]) => {

      // console.log("tag nè: " + JSON.stringify(valueTag))
      for (const c of res.locals.Action) {
        if (c.idTrangThai === +id) {
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

      for (const d of row2) {
        if (d.TrangThai === +1 || d.TrangThai === +2) {
          d.flat = true;
        }
      }
      res.render('writer/dsbaiviet', {
        trangthai: row1,
        Baiviet: row2,
        pages,
        layout: '../writer/main'
      })

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
    ChuyenMuc: req.body.optTenCM,
  }

  var entity2 = {
  
  }

  Promise.all([
    writerModal.category(),
    writerModal.tag(),
    writerModal.addNews(entity)
  ]).
    then(([row, row1, row2]) => {
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

router.get('/rewrite/:idBB', (req, res, next) => {
  var id = req.params.idBB;
  Promise.all([
    writerModal.rewrite(id),
    writerModal.category(),
    writerModal.tag()
  ]).then(([row, row1, row2]) => {

    for (const c of row1) {
      if(c.idChuyenMuc === +row[0].ChuyenMuc){
        c.isSelected = true;
      }
    }

    res.render('writer/rewrite.hbs', {
      Rewrite: row,
      cat: row1,
      tag: row2,
      layout: '../writer/main'
    });
  }).catch(next);
})

router.post('/rewrite/:idBB', (req, res, next) => {
  var id = req.params.idBB;
  var datetime = new Date();
  var dob = moment(datetime, 'DD/MM/YYYY').format('YYYY-MM-DD');
  var entity = {
    idBaiBao: id,
    TenBaiBao: req.body.txtTitle,
    NoiDungTomTat: req.body.summary,
    NoiDung: req.body.editor,
    NgayDang: dob,
    TacGia: 4,
    TrangThai: 3,
    AnhDaiDien: req.body.img,
    premium: 1,
    luotXem: 0,
    ChuyenMuc: req.body.optTenCM,
  }

  writerModal.update(entity).then(id=>{
    res.redirect('/writing/3');
  })
})

module.exports = router;