var express = require('express');
var userCM = require('../../model/admin/ChuyenMuc');
var nhanTag = require('../../model/admin/TheTag');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('admin-hbs/TrangChuAdmin', {
        layout: './main-layout'
    });
})

router.get('/QuanLiChuyenMuc', (req, res, next) => {
    Promise.all([
        userCM.CMCap1(),
        userCM.getallnamebyid()
    ]).then(([cate1,cate2]) => {
        var dem = 0;
        var i = 0;
        for (const c of cate2) {
            dem += 1;
            cate2[i].stt = dem;
            i += 1;
        }
        res.render('admin-hbs/QLChuyenMuc', {
            cap1: cate1,
            cap2: cate2,
            layout: './main-layout',
        });
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });

})

router.get('/QuanLiTheTag', (req,res, next) => {
    nhanTag.all().then(rows => {
        var dem = 0;
        var i = 0;
        for (const c of rows) {
            dem += 1;
            rows[i].stt = dem;
            i += 1;
        }
        res.render('admin-hbs/TheTag/QLTheTag',{
            listTag: rows,
            layout: './main-layout'
        })
    })

  
})



module.exports = router;

