var express = require('express');
var userCate = require('../../model/admin/ChuyenMuc');
var BBModel = require('../../model/admin/QLBaiBao');
var CMModel = require('../../model/admin/ChuyenMuc');
var moment = require('moment');
var router = express.Router();

var auth = require('../../middlewares/auth');

router.get('/',auth, (req, res) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var page = req.query.page || 1;
        if (page < 1) page = 1;

        var limit = 10;
        var offset = (page - 1) * limit;

        Promise.all([
            BBModel.GetTTByID(limit, offset),
            BBModel.countBB(),
        ])
            .then(([row1, count_rows]) => {
                var total = count_rows[0].total;
                var nPages = Math.floor(total / limit);
                if (total % limit > 0) nPages++;
                var pages = [];
                for (i = 1; i <= nPages; i++) {
                    var obj = { value: i, active: i === +page };
                    pages.push(obj);
                }

                var dem = 0;
                var i = 0;
                for (const c of row1) {
                    dem += 1;
                    row1[i].stt = dem;
                    i += 1;
                }

                res.render('admin-hbs/BaiBao/QLBaiBao', {
                    dsBaiBao: row1,
                    pages,
                    layout: './main-layout'
                })
            })
    }

})

router.post('/delete/:id', (req, res) => {
    var id = req.params.id;
    var entity = {
        idBaiBao: id,
        Xoa: 1,
    }
    BBModel.update(entity);
    res.redirect('/admin/QuanLiBaiBao');
})

router.get('/edit/:id',auth, (req, res) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var id = req.params.id;
        BBModel.GetSingleTT(id).then(row => {
            CMModel.CMCap2().then(row2 => {
                for (const b of row2) {
                    if (b.idChuyenMuc === +row[0].ChuyenMuc) {
                        b.isSelec = true;
                    }
                }
                var Co = false;
                var Khong = false;
                if (row[0].Premium == 1) {
                    Co = true;
                }
                if (row[0].Premium == 0) {
                    Khong = true;
                }
                var isChoDuyet = false;
                if (row[0].TrangThai == 3) {
                    isChoDuyet = true;
                }
                res.render('admin-hbs/BaiBao/EditBaiBao', {
                    isChoDuyet: isChoDuyet,
                    Co: Co,
                    Khong: Khong,
                    chuyenmuc: row2,
                    baibao: row[0],
                    layout: './main-layout'
                });
            })

        })
    }

})

router.post('/edit/:id', (req, res) => {
    var id = req.params.id;
    var temp = req.body;
    var date = moment(temp.NgayDang, 'DD/MM/YYYY').format('YYYY-MM-DD');

    if (temp.TrangThai == null) {
        var entity = {
            idBaiBao: id,
            TenBaiBao: temp.TenBaiBao,
            ChuyenMuc: temp.ChuyenMuc,
            NgayDang: date,
            NoiDung: temp.NoiDung,
            NoiDungTomTat: temp.NDTT,
            AnhDaiDien: temp.avatar,
            Premium: temp.premium,
            Xoa: 0,
        }
    }
    else {
        var entity = {
            idBaiBao: id,
            TenBaiBao: temp.TenBaiBao,
            ChuyenMuc: temp.ChuyenMuc,
            NgayDang: date,
            TrangThai: temp.TrangThai,
            NoiDung: temp.NoiDung,
            NoiDungTomTat: temp.NDTT,
            AnhDaiDien: temp.avatar,
            Premium: temp.premium,
            Xoa: 0,
        }

    }
    BBModel.update(entity);
    res.redirect('/admin/QuanLiBaiBao');
})



module.exports = router;

