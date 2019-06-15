var express = require('express');
//var userCate = require('../../model/admin/ChuyenMuc');
var TagModel = require('../../model/admin/TheTag');
var router = express.Router();

router.get('/addTag', (req,res,nexr)=>{
    var check = true;
    res.render('admin-hbs/TheTag/AddTheTag',{
        check: check,
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

router.get('/Edit/:id', (req,res,nexr)=>{
    var check = false
    var id = req.params.id;
    TagModel.GetTagById(id).then(row => {        
        res.render('admin-hbs/TheTag/AddTheTag',{
            check:check,
            tag:row[0],
            layout: './main-layout'
        })
    })
     
})


router.post('/Edit', (req,res,nexr)=>{
    var temp = req.body;
    var entity = {
        idTag: temp.id,
        tenTag: temp.TenTag,
        Xoa: 0,
    }
    TagModel.update(entity);
    res.redirect('/admin/QuanLiTheTag')
})

router.get('/delete/:id', (req,res,nexr)=>{
    var id = req.params.id;
    var entity ={
        idTag : id,
        Xoa: 1,
    }
    TagModel.update(entity);
    res.redirect('/admin/QuanLiTheTag');
})

module.exports = router;

