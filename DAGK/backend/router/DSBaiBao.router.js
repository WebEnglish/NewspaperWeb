var express = require('express');
var categoryModel = require('../model/DSBaiBao');
var writerModal = require('../model/Forwriter');
var baibaoModal = require('../model/DSBaiBao');
var moment = require('moment');
var router = express.Router();


router.get('/home', function (req, res, next) {
  Promise.all([
    categoryModel.all(),
    categoryModel.t10mostview(),
    categoryModel.newest(),
    categoryModel.topCat(),
    categoryModel.top1view(),
  ]).then(([row, rows, rows1, row2, row3]) => {

    for (const c of row) {
      if (c.idBaiBao === row[0].idBaiBao) {
        c.IsActive = true;
      }
    }

    var currentDay = new Date();
    var day = moment(currentDay).format('YYYY/MM/DD');
    var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');

    for (const d of rows) {
      if (d.Premium == 1) {
        if (nhh > day) {
          d.isPremium = true;
        }

      }
    }

    for (const e of rows1) {
      if (e.Premium == 1) {
        if (nhh > day) {
          e.isPremium = true;
        }
      }
    }

    for (const f of row2) {
      if (f.Premium == 1) {
        if (nhh > day) {
          f.isPremium = true;
        }
      }
    }

    res.render('home.hbs', {
      carousels: row,
      top10: rows,
      newest: rows1,
      topcat: row2,
      topview1: row3,
      layout: './main'
    });
  }).catch(next);
});


router.get('/', function (req, res, next) {
  Promise.all([
    categoryModel.all(),
    categoryModel.t10mostview(),
    categoryModel.newest(),
    categoryModel.topCat(),
    categoryModel.top1view()
  ]).then(([row, rows, rows1, row2, row3]) => {

    for (const c of row) {
      if (c.idBaiBao === row[0].idBaiBao) {
        c.IsActive = true;
      }
    }

    for (const d of rows) {
      if (d.Premium == 1) {       
          d.isPremium = true;
      }
    }

    for (const e of rows1) {
      if (e.Premium == 1) {
          e.isPremium = true;
      }
    }

    for (const f of row2) {
      if (f.Premium == 1) {
          f.isPremium = true;
      }
    }

    res.render('home.hbs', {
      carousels: row,
      top10: rows,
      newest: rows1,
      topcat: row2,
      topview1: row3,
      layout: './main'
    });
  }).catch(next);
});

router.get('/:idCM', (req, res, next) => {
  var id = req.params.idCM;

  var page = req.query.page || 1;
  if (page < 1) page = 1;

  var limit = 6;
  var offset = (page - 1) * limit;

  Promise.all([
    categoryModel.allByCat(id),
    categoryModel.pageByCat(id, limit, offset),
    categoryModel.pageByCat2(id, limit, offset),
    categoryModel.countByCat(id),
    categoryModel.tag(id)
  ]).then(([cate, rows, rows2, count_rows, valueTag]) => {

    // console.log("tag nè: " + JSON.stringify(valueTag))
    for (const c of res.locals.ChuyenMuc) {
      if (c.idcon1 === +id || c.idcon2 === +id) {
        c.isActive = true;
      }
    }
    var currentDay = new Date();
    var day = moment(currentDay).format('YYYY/MM/DD');
    var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');

    for (const d of rows2) {
      if (d.Premium == 1) {
        if (nhh > day) {
          d.isPremium = true;
        }
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

    res.render('dsbaibao-theo-chuyenmuc.hbs', {
      cat: cate,
      bycat: rows,
      bycat2: rows2,
      pages,
      tag: valueTag,
      layout: './main'
    });

  }).catch(next);
});

router.get('/writing', (req, res, next) => {
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

router.get("/tag/:idTag", (req, res, next) => {
  var id = req.params.idTag;

  var page = req.query.page || 1;
  if (page < 1) page = 1;

  var limit = 6;
  var offset = (page - 1) * limit;

  Promise.all([
    categoryModel.byTag(id, limit, offset),
    categoryModel.countByTag(id),
    categoryModel.tagByTag(id),
    categoryModel.byTag2(id, limit, offset)
  ])
    .then(([row, count_rows, row2, row3]) => {

      var total = count_rows[0].total;
      var nPages = Math.floor(total / limit);
      if (total % limit > 0) nPages++;
      var pages = [];
      for (i = 1; i <= nPages; i++) {
        var obj = { value: i, active: i === +page };
        pages.push(obj);
      }

      var currentDay = new Date();
      var day = moment(currentDay).format('YYYY/MM/DD');
      var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');

      for (const d of row3) {
        if (d.Premium == 1) {
          if (nhh > day) {
            d.isPremium = true;
          }
        }
      }


      res.render('dsbaibao-theo-tag.hbs', {
        Bytag: row,
        pages,
        Tagbytag: row2,
        Bytag2: row3,
        layout: './main'
      }).catch(next);
    })
})

router.get('/:idCM/:idBB', function (req, res) {
  var id = req.params.idBB;
  var idcm = req.params.idCM;

  Promise.all([
    baibaoModal.newsdetail(id),
    baibaoModal.newstag(id),
    baibaoModal.comment(id),
    baibaoModal.relate(id)
  ]).then(([row, row1, row2, row3]) => {

    for (const c of res.locals.ChuyenMuc) {
      if (c.idcon1 === +idcm || c.idcon2 === +idcm) {
        c.isActive = true;
      }
    }

    var currentDay = new Date();
    var day = moment(currentDay).format('YYYY/MM/DD');
    var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');

    for (const d of row) {
      if (d.Premium == 1) {
        if (nhh > day) {
          d.isPremium = true;
        }
      }
    }

    res.render('bai-bao', {
      detail: row,
      tagnews: row1,
      cmt: row2,
      relatebb: row3,
      layout: './main'
    });
  }).catch(err => {
    console.log(err);
    res.end('error occured!')
  });
});

router.post('/:idCM/:idBB', function (req, res, next) {
  //console.log(req.body);
  var datetime = new Date();
  var id = req.params.idBB;
  var idcm = req.params.idCM;
  var entity = {
    NoiDung: req.body.comment,
    BaiBao: id,
    NgayDang: datetime,
    NguoiBL: req.user.idThanhVien
  }


  baibaoModal.addComment(entity)
    .then(n => {
      res.redirect('back');
    })
    .catch(err => {
      console.log(err);
      res.end('error occured!')
    });

});

router.post('/:id', (req, res) => {
  var id = req.params.id;
  var entity = {
    idBaiBao: id,
    LyDoTuChoi: req.body.lido,
    TrangThai: 4,
  }
  writerModal.update(entity);
  res.redirect('/editor')
});

module.exports = router;