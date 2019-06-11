var express = require('express');
var userCate = require('../../model/admin/ChuyenMuc');
var MemberModel = require('../../model/User-model');
var router = express.Router();


router.post('/', (req, res, next) => {
    var lcmCap1 = req.body.LCMCap1;
    if (isNaN(lcmCap1)) {
        Promise.all([
            userCate.CMCap1(),
            userCate.getallnamebyid()
        ]).then(([cate1, cate2]) => {
            res.render('admin-hbs/QLChuyenMuc', {
                cap1: cate1,
                cap2: cate2,
                layout: './main-layout',
            });
        }).catch(err => {
            console.log(err);
            res.end('error occured.')
        });
    }
    else {
        Promise.all([
            userCate.CMCap1(),
            userCate.LocCM(lcmCap1)
        ]).then(([cate1, cate2]) => {
            for (const c of cate1) {
                if (c.idChuyenMuc === +lcmCap1) {
                    c.isSelected = true;
                }
            }
            res.render('admin-hbs/QLChuyenMuc', {
                cap1: cate1,
                cap2: cate2,
                layout: './main-layout'
            });
        })
    }

})

router.get('/delete/:id', (req, res) => {
    var entity = {
        idChuyenMuc: req.params.id,
        Xoa: 1
    }
    userCate.update(entity).then(n => {
        res.redirect('/admin/QuanLiChuyenMuc');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

router.get('/add', (req, res) => {
    Promise.all([
        MemberModel.all(),
        userCate.CMCap1()
    ]).then(([ten, loai]) => {
        res.render('admin-hbs/AddChuyenMuc', {
            member: ten,
            cate: loai,
            layout: './main-layout'
        });
    })
})


router.post('/add', (req, res) => {
    var a = req.body;
    if (a.check1 === "on") {
        var entity = {
            TenCM: req.body.tencm,
            NguoiQuanLyCM: req.body.manager,
            LoaiCM: 0,
            Xoa: 0
        }
        userCate.add(entity).then(id => {
            res.redirect('/admin/QuanLiChuyenMuc/add');
        }).catch(err => {
            console.log(err);
            res.end('error occured.')
        });
    }
    else {
        var entity = {
            TenCM: req.body.tencm,
            NguoiQuanLyCM: req.body.manager,
            LoaiCM: req.body.cate,
            Xoa: 0
        }
        userCate.add(entity).then(id => {
            res.redirect('/admin/QuanLiChuyenMuc/add');
        }).catch(err => {
            console.log(err);
            res.end('error occured.')
        });

    }


})

router.get('/edit/:ida', (req, res) => {
    var id = req.params.ida;
    var check;
    userCate.all().then(allcm => {
        for (const temp of allcm) {
            if (temp.idChuyenMuc === +id && temp.LoaiCM === 0) {
                check = 1;
                break;
            }
            else { check = 0; }
        }
        if (check === 0) {
            Promise.all([
                userCate.allNguoiQuanLi(),
                userCate.getCateC1(id),
                userCate.CMCap1(),
                userCate.NguoiQuanLi(id),
                userCate.singleCap2(id)

            ]).then(([rows1, rows2, rows3, rows4, rows5]) => {
                for (const a of rows1) {
                    if (a.idThanhVien === +rows4[0].idThanhVien) {
                        a.isSelected = true;
                       
                    }
                }
                for (const b of rows3) {
                    if (b.idChuyenMuc === +rows2[0].idChuyenMuc) {
                        b.isSelec = true;
                    }
                }
                var kiemTra = false;
                res.render('admin-hbs/EditChuyenMuc', {
                    kiemtra: kiemTra,
                    member: rows1,
                    allCate: rows3,
                    catec: rows5[0],
                    layout: './main-layout'

                })
            }).catch(err => {
                console.log(err);
                res.end('error m occured.')
            });
        }
        else {
            Promise.all([
                userCate.allNguoiQuanLi(),
                userCate.NguoiQuanLi(id),
                userCate.singleCap1(id)

            ]).then(([rows1, rows2, rows3]) => {
                for (const a of rows1) {
                    if (a.idThanhVien === +rows2[0].idThanhVien) {
                        a.isSelected = true;
                        
                    }
                }
                var kiemTra = true;
                res.render('admin-hbs/EditChuyenMuc', {
                    kiemtra: kiemTra,
                    
                    member: rows1,
                    catec: rows3[0],
                    layout: './main-layout'

                })
            })

        }
    })



    // if (isNaN(id)) {
    //     res.render('admin-hbs/EditChuyenMuc', {
    //         layout: './main-layout',
    //         error: true
    //     });
    // }

})

router.post('/update', (req, res, next) => {
    var temp = req.body;
    if (temp.cate == null) {
        temp.cate = 0;
    }

    var entity = {
        idChuyenMuc: temp.id,
        TenCM: temp.tencm,
        NguoiQuanLyCM: temp.manager,
        LoaiCM: temp.cate
    }
    userCate.update(entity).then(id => {
        res.redirect('/admin/QuanLiChuyenMuc')
    })
})

router.post('/editC1', (req, res, next) => {
    var a = req.body.LCMCap1;
    res.redirect('/admin/QuanLiChuyenMuc/edit/' + a);
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

