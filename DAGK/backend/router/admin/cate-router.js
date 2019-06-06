var express = require('express');
var userCate = require('../../model/admin/ChuyenMuc');
var router = express.Router();


router.post('/update', (req, res) => {
})

router.get('/delete/:id', (req, res) => {
    var entity = {
        idChuyenMuc : req.params.id,
        Xoa: 1
    }    
    userCate.update(entity).then(n => {
        console.log(entity);
        res.redirect('/admin/QuanLiChuyenMuc');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });


    // 
    // userCate.delete(id).then(n=>{
    //     res.redirect('/admin/QuanLiChuyenMuc');
    // }).catch(err=>{
    //     console.log(err);
    //     res.end('error occured');
    // })
})

// router.get('/update/:id', (req, res) => {
//     var id = req.params.id;

//     userCate.delete(id).then(n => {
//         res.redirect('/admin/QuanLiChuyenMuc');
//     }).catch(err => {
//         console.log(err);
//         res.end('error occured');
//     })
// })

module.exports = router;
