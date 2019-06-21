var express = require('express');
var categoryModel = require('../model/DSBaiBao');
var writerModal = require('../model/Forwriter');
var baibaoModal = require('../model/DSBaiBao');
var moment = require('moment');
var router = express.Router();

router.post('/search', (req, res, next) => {
  var txtSearch = req.body.searchInput;
  var nht = new Date();
  var ngayHT = moment(nht).format('YYYY/MM/DD');
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;

  if (req.user) {
    var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');
    if (nhh > ngayHT || req.user.PhanHe == 2 || req.user.PhanHe == 3 || req.user.PhanHe == 4 ) {
      //Hết hạn
     baibaoModal.searchCTK(txtSearch, limit,offset).then(row => {
        var total = row.length;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
          var obj = { value: i, active: i === +page };
          pages.push(obj);
        }
        var tontai = false;
        if (row.length != 0) {
          tontai = true;
          res.render('ketquatimkiem', {
            isExsist: tontai,
            bycat2: row,
            pages,
            layout: './main'
          });
        }
        else {
          res.render('ketquatimkiem', {
            layout: './main'
          });
        }
      })
    }
    else {
      //Còn hạn 
      baibaoModal.searchKTK(txtSearch, limit,offset).then(row => {
        var total = row.length;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
          var obj = { value: i, active: i === +page };
          pages.push(obj);
        }
        var tontai = false;
        if (row.length != 0) {
          tontai = true;
          res.render('ketquatimkiem', {
            isExsist: tontai,
            bycat2: row,
            pages,
            layout: './main'
          });
        }
        else {
          res.render('ketquatimkiem', {
            layout: './main'
          });
        }
      })
      
    }

  }
  else {
    Promise.all([
      baibaoModal.searchKTK(txtSearch, limit,offset),
      baibaoModal.countsearchKTK(txtSearch)
    ])
    .then(([row, count_rows]) => {
      var total =count_rows[0].total;
      var nPages = Math.floor(total / limit);
      if (total % limit > 0) nPages++;
      var pages = [];
      for (i = 1; i <= nPages; i++) {
        var obj = { value: i, active: i === +page };
        pages.push(obj);
      }
      var tontai = false;
      if (row.length != 0) {
        tontai = true;
        res.render('ketquatimkiem', {
          isExsist: tontai,
          bycat2: row,
          pages,
          layout: './main'
        });
      }
      else {
        res.render('ketquatimkiem', {
          layout: './main'
        });
      }
    }).catch(next);

  }

})

router.get('/home', function (req, res, next) {
  categoryModel.getAllBaiBao().then(AllList => {
    var day = new Date();
    var NgayHienTai = moment(day).format('YYYY/MM/DD');
    var i = 0;
    for (const x of AllList) {
      var nxb = moment(AllList[i].NgayXuatBan).format('YYYY/MM/DD');
      if (nxb <= NgayHienTai && AllList[i].TrangThai == 2) {
        var entity = {
          idBaiBao: AllList[i].idBaiBao,
          TrangThai: 1
        }
        categoryModel.updateBaiBao(entity);
      }
      i += 1;
    }
  })

  Promise.all([
    categoryModel.all(),
    categoryModel.t10mostview(),
    categoryModel.newest(),
    categoryModel.topCat(),
    categoryModel.top1view(),
    categoryModel.t10mostview2(),
    categoryModel.newest2(),
    categoryModel.topCat2(),
  ]).then(([row, rows, rows1, row2, row3, row4, row5, row6]) => {
    if (!req.user) {
      for (const c of row) {
        if (c.idBaiBao === row[0].idBaiBao) {
          c.IsActive = true;
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
    }
    else {
      var currentDay = new Date();
      var day = moment(currentDay).format('YYYY/MM/DD');
      var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');
      if (nhh > day || req.user.PhanHe == 2 || req.user.PhanHe == 3 || req.user.PhanHe == 4) {
        for (const c of row) {
          if (c.idBaiBao === row[0].idBaiBao) {
            c.IsActive = true;
          }
        }
        res.render('home.hbs', {
          carousels: row,
          top10: row4,
          newest: row5,
          topcat: row6,
          layout: './main'
        });
      }
      else {
        for (const c of row) {
          if (c.idBaiBao === row[0].idBaiBao) {
            c.IsActive = true;
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
      }
    }
  }).catch(next);
});


router.get('/', function (req, res, next) {

  categoryModel.getAllBaiBao().then(AllList => {
    var day = new Date();
    var NgayHienTai = moment(day).format('YYYY/MM/DD');
    var i = 0;
    for (const x of AllList) {
      var nxb = moment(AllList[i].NgayXuatBan).format('YYYY/MM/DD');
      if (nxb <= NgayHienTai && AllList[i].TrangThai == 2) {
        var entity = {
          idBaiBao: AllList[i].idBaiBao,
          TrangThai: 1
        }
        categoryModel.updateBaiBao(entity);
      }
      i += 1;
    }
  })
  Promise.all([
    categoryModel.all(),
    categoryModel.t10mostview(),
    categoryModel.newest(),
    categoryModel.topCat(),
    categoryModel.top1view(),
    categoryModel.t10mostview2(),
    categoryModel.newest2(),
    categoryModel.topCat2(),
  ]).then(([row, rows, rows1, row2, row3, row4, row5, row6]) => {

    if (!req.user) {
      for (const c of row) {
        if (c.idBaiBao === row[0].idBaiBao) {
          c.IsActive = true;
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
    }
    else {
      var currentDay = new Date();
      var day = moment(currentDay).format('YYYY/MM/DD');
      var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');
      if (nhh > day || req.user.PhanHe == 2 || req.user.PhanHe == 3 || req.user.PhanHe == 4) {
        for (const c of row) {
          if (c.idBaiBao === row[0].idBaiBao) {
            c.IsActive = true;
          }
        }
        res.render('home.hbs', {
          carousels: row,
          top10: row4,
          newest: row5,
          topcat: row6,
          layout: './main'
        });
      }
      else {
        for (const c of row) {
          if (c.idBaiBao === row[0].idBaiBao) {
            c.IsActive = true;
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
      }
    }

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
    categoryModel.countByCatnoPre(id),
    categoryModel.tag(id)
  ]).then(([cate, rows, rows2, count_rows, count_rows1, valueTag]) => {
    for (const c of res.locals.ChuyenMuc) {
      if (c.idcon1 === +id || c.idcon2 === +id) {
        c.isActive = true;
      }
    }


    if (!req.user) {
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
        pages,
        tag: valueTag,
        layout: './main'
      });
    }
    else {
      var total = count_rows1[0].total;
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
      if (nhh > day || (req.user.PhanHe == 2 || req.user.PhanHe == 3 || req.user.PhanHe == 4)) {//còn hạn
        res.render('dsbaibao-theo-chuyenmuc.hbs', {
          cat: cate,
          bycat: rows2,
          pages,
          tag: valueTag,
          layout: './main'
        });
      }
      else if (nhh < day) { //Hết hạn
        res.render('dsbaibao-theo-chuyenmuc.hbs', {
          cat: cate,
          bycat: rows,
          pages,
          tag: valueTag,
          layout: './main'
        });
      }
    }
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
    categoryModel.byTag2(id, limit, offset),
    categoryModel.countByTag2(id),
  ])
    .then(([row, count_rows, row2, row3, count_rows2]) => {

      if(!req.user){
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
          var obj = { value: i, active: i === +page };
          pages.push(obj);
        }

        res.render('dsbaibao-theo-tag.hbs', {
          Bytag: row,
          pages,
          Tagbytag: row2,
          layout: './main'
        })
      }
      else{
        var total = count_rows2[0].total;
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
        if (nhh > day || (req.user.PhanHe == 2 || req.user.PhanHe == 3 || req.user.PhanHe == 4)) {//còn hạn
          res.render('dsbaibao-theo-tag.hbs', {
            Bytag: row3,
            pages,
            Tagbytag: row2,
            layout: './main'
          })
        }
        else if (nhh < day) { //Hết hạn
          res.render('dsbaibao-theo-chuyenmuc.hbs', {
            cat: cate,
            bycat: rows,
            pages,
            tag: valueTag,
            layout: './main'
          });
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
    }).catch(next);
})

router.get('/:idCM/:idBB', function (req, res) {
  var id = req.params.idBB;
  var idcm = req.params.idCM;

  Promise.all([
    baibaoModal.newsdetail(id),
    baibaoModal.newstag(id),
    baibaoModal.comment(id),
    baibaoModal.relate(id),
    baibaoModal.relate2(id)
  ]).then(([row, row1, row2, row3, row4]) => {

    for (const c of res.locals.ChuyenMuc) {
      if (c.idcon1 === +idcm || c.idcon2 === +idcm) {
        c.isActive = true;
      }
    }

    if (!req.user) {
      res.render('bai-bao', {
        detail: row,
        tagnews: row1,
        cmt: row2,
        relatebb: row3,
        layout: './main'
      });
    }
    else {
      var currentDay = new Date();
      var day = moment(currentDay).format('YYYY/MM/DD');
      var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');

     if(nhh > day || (req.user.PhanHe == 2 || req.user.PhanHe == 3 || req.user.PhanHe == 4)){
      res.render('bai-bao', {
        detail: row,
        tagnews: row1,
        cmt: row2,
        relatebb: row4,
        layout: './main'
      });
     }
     else{
      res.render('bai-bao', {
        detail: row,
        tagnews: row1,
        cmt: row2,
        relatebb: row3,
        layout: './main'
      });
     }
    }
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