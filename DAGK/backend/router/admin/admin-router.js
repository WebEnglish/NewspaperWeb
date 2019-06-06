var express = require('express');
var userCM = require('../../model/admin/ChuyenMuc');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('abc', {
        layout: './main-layout'
    });
})

router.get('/QuanLiChuyenMuc', (req, res, next) => {
    userCM.CMCap().then(row => {
        res.render('admin-hbs/QLChuyenMuc', {
            layout: './main-layout',
            cate: row
        });
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });

})



module.exports = router;

