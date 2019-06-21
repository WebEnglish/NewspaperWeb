var express = require('express');
//var userCate = require('../../model/admin/ChuyenMuc');
var TagModel = require('../../model/admin/TheTag');
var router = express.Router();

var auth = require('../../middlewares/auth');

router.get('/addTag',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var check = true;
        res.render('admin-hbs/TheTag/AddTheTag', {
            check: check,
            layout: './main-layout'
        })
    }
})

router.get('/addTag/isExsist',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var TenTag = req.query.TenTag;
        TagModel.getTagbyName(TenTag).then(rows => {
            if (rows.length > 0) {
                return res.json(false);
            }
            return res.json(true);
        })
    }

})

router.post('/addTag', (req, res, nexr) => {
    var entity = {
        tenTag: req.body.TenTag,
        Xoa: 0
    }
    TagModel.add(entity).then(id => {
        res.redirect('/admin/QuanLiTheTag')
    })
})

router.get('/Edit/:id',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var check = false
        var id = req.params.id;
        TagModel.GetTagById(id).then(row => {
            res.render('admin-hbs/TheTag/AddTheTag', {
                check: check,
                tag: row[0],
                layout: './main-layout'
            })
        })
    }

})


router.post('/Edit', (req, res, nexr) => {
    var temp = req.body;
    var entity = {
        idTag: temp.id,
        tenTag: temp.TenTag,
        Xoa: 0,
    }
    TagModel.update(entity);
    res.redirect('/admin/QuanLiTheTag')
})

router.post('/delete/:id', (req, res, nexr) => {
    var id = req.params.id;
    var entity = {
        idTag: id,
        Xoa: 1,
    }
    TagModel.update(entity);
    res.redirect('/admin/QuanLiTheTag');
})

module.exports = router;

