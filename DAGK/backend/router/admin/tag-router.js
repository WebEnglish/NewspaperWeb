var express = require('express');
//var userCate = require('../../model/admin/ChuyenMuc');
var TagModel = require('../../model/admin/TheTag');
var router = express.Router();

router.get('/addTag', (req,res,nexr)=>{
    res.render('admin-hbs/TheTag/AddTheTag',{
        layout: './main-layout'
    })
})

router.post('/addTag', (req,res,nexr)=>{
    var entity = {
        tenTag: req.body.TenTag,
        Xoa : 0
    }
    TagModel.add(entity).then(id =>{
        res.redirect('/admin/QuanLiTheTag')
    })
})

module.exports = router;

