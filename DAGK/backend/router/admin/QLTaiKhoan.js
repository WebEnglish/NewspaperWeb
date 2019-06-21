var express = require('express');
var moment = require('moment');
var bcrypt = require('bcrypt');
var DGModel = require('../../model/admin/TKDocGia-model');
var router = express.Router();

var auth = require('../../middlewares/auth');

router.get('/DocGia',auth, (req, res) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        DGModel.all().then(rows => {
            var Day = new Date();
            var curDay = moment(Day).format('YYYY/MM/DD');
            var isdocgia = true;
            var dem = 0;
            var i = 0;
            for (const c of rows) {
                var nhh = moment(rows[i].NgayHetHan).format('YYYY/MM/DD')
                dem += 1;
                rows[i].stt = dem;
                if (nhh < curDay && rows[i].TinhTrang == 0) {
                    rows[i].tt = 'Đã hết hạn'
                }
                else if (nhh < curDay && rows[i].TinhTrang == 1) {
                    rows[i].tt = 'Đang yêu cầu gia hạn'
                }
                else {
                    rows[i].tt = 'Còn hạn sử dụng'
                }
                i += 1;

            }
            for (const c of rows) {
                c.isdocgia = true;
            }
            res.render('admin-hbs/DocGia/QLDocGia', {
                isdocgia: isdocgia,
                docgia: rows,
                layout: './main-layout.hbs'
            })
        })
    }

})

router.post('/DocGia/delete/:id', (req, res, nexr) => {
    var id = req.params.id;
    var entity = {
        idThanhVien: id,
        Xoa: 1,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/DocGia');
})

router.get('/DocGia/AddDG',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        res.render('admin-hbs/DocGia/AddDocGia', {
            layout: './main-layout'
        })
    }

})

router.post('/DocGia/AddDG', (req, res, next) => {

    var saltRounds = 10;
    var todays = new Date();
    var die = new Date();
    die.setDate(die.getDate() + 7);
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var date = moment(todays, 'DD/MM/YYYY').format('YYYY-MM-DD')
    var expire = moment(die, 'DD/MM/YYYY').format('YYYY-MM-DD')
    var entity = {
        HoTen: req.body.fullName,
        NgaySinh: dob,
        Email: req.body.email,
        MatKhau: hash,
        PhanHe: 1,
        NgayKichHoat: date,
        NgayHetHan: expire
    }
    DGModel.add(entity).then(id => {
        res.redirect('/admin/QuanLiTaiKhoan/DocGia');
    })
})

router.get('/DocGia/edit/:id',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var id = req.params.id;
        var isdocgia = true;
        DGModel.GetTKbyID(id).then(row => {
            var Day = new Date();
            var curDay = moment(Day).format('YYYY/MM/DD');
            var nhh = moment(row[0].NgayHetHan).format('YYYY/MM/DD')
            var isHH = false;
            if (nhh < curDay) {
                var isHH = true;
            }

            res.render('admin-hbs/DocGia/DetailTK', {
                isdocgia: isdocgia,
                isHH: isHH,
                docgia: row[0],
                layout: './main-layout'
            })
        })
    }

})



router.post('/DocGia/edit/:id', (req, res, next) => {
    var id = req.params.id;
    var temp = req.body;
    var dob = moment(temp.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var entity = {
        idThanhVien: id,
        HoTen: temp.ten,
        Email: temp.email,
        NgaySinh: dob,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/DocGia')
})

router.get('/writer',auth, (req, res) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        DGModel.allWriter().then(rows => {
            var dem = 0;
            var i = 0;
            for (const c of rows) {
                dem += 1;
                rows[i].stt = dem;
                i += 1;
            }
            res.render('admin-hbs/QL_Writer/QLWriter', {
                docgia: rows,
                layout: './main-layout.hbs'
            })
        })
    }
})

router.get('/writer/Add',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var writer = true;
        res.render('admin-hbs/DocGia/AddDocGia', {
            writer: writer,
            layout: './main-layout'
        })
    }
})

router.post('/writer/Add', (req, res, next) => {

    var saltRounds = 10;
    // var todays = new Date();
    // var die = new Date();
    // die.setDate(die.getDate() + 7);
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    // var date = moment(todays, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // var expire = moment(die, 'DD/MM/YYYY').format('YYYY-MM-DD')
    var entity = {
        HoTen: req.body.fullName,
        ButDanh: req.body.butdanh,
        NgaySinh: dob,
        Email: req.body.email,
        MatKhau: hash,
        PhanHe: 2,
        // NgayKichHoat: date,
        // NgayHetHan: expire
    }
    var a = 2;
    DGModel.addWriter(entity).then(id => {
        res.redirect('/admin/QuanLiTaiKhoan/writer');
    })
})

router.post('/writer/delete/:id', (req, res, nexr) => {
    var id = req.params.id;
    var entity = {
        idThanhVien: id,
        Xoa: 1,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/writer');
})

router.get('/writer/edit/:id',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var iswriter = true;
        var id = req.params.id;
        DGModel.GetTKbyID(id).then(row => {
            res.render('admin-hbs/DocGia/DetailTK', {
                iswriter: iswriter,
                docgia: row[0],
                layout: './main-layout'
            })
        })
    }
})

router.post('/writer/edit/:id', (req, res, next) => {
    var id = req.params.id;
    var temp = req.body;
    var dob = moment(temp.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var entity = {
        idThanhVien: id,
        HoTen: temp.ten,
        ButDanh: temp.butdanh,
        Email: temp.email,
        NgaySinh: dob,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/writer')
})

router.get('/editor',auth, (req, res) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var iseditor = true;
        DGModel.allEditor().then(rows => {
            var dem = 0;
            var i = 0;
            for (const c of rows) {
                dem += 1;
                rows[i].stt = dem;
                i += 1;
            }
            for (const c of rows) {
                c.iseditor = true;
            }
            res.render('admin-hbs/DocGia/QLDocGia', {
                docgia: rows,
                iseditor: iseditor,
                layout: './main-layout.hbs'
            })
        })
    }

})


router.get('/editor/add',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        DGModel.allCMCap2().then(rows => {
            var iseditor = true;
            res.render('admin-hbs/DocGia/AddDocGia', {
                chuyenMuc: rows,
                iseditor: iseditor,
                layout: './main-layout'
            })
        })
    }

})

router.post('/editor/add', (req, res, next) => {
    var saltRounds = 10;
    //var todays = new Date();
    var die = new Date();
    die.setDate(die.getDate() + 7);
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    // var date = moment(todays, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // var expire = moment(die, 'DD/MM/YYYY').format('YYYY-MM-DD')
    var entity = {
        HoTen: req.body.fullName,
        NgaySinh: dob,
        QuanLiCM: req.body.CMQuanLi,
        Email: req.body.email,
        MatKhau: hash,
        PhanHe: 3,
        // NgayKichHoat: date,
        // NgayHetHan: expire
    }
    DGModel.add(entity).then(id => {
        res.redirect('/admin/QuanLiTaiKhoan/editor');
    })
})

router.post('/editor/delete/:id', (req, res, nexr) => {
    var id = req.params.id;
    var entity = {
        idThanhVien: id,
        Xoa: 1,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/editor');
})

router.get('/editor/edit/:id',auth, (req, res, nexr) => {
    if (req.user.PhanHe != 4) {
        res.redirect('/home');
    }
    else {
        var iseditor = true;
        var id = req.params.id;
        DGModel.GetTKbyID(id).then(row1 => {
            var idCM = row1[0].QuanLiCM;
            DGModel.allCMCap2().then(row3 => {
                for (const c of row3) {
                    if (c.idChuyenMuc === +idCM) {
                        c.isSelected = true;
                    }
                }
                res.render('admin-hbs/DocGia/DetailTK',
                    {
                        iseditor: iseditor,
                        docgia: row1[0],
                        dsCM: row3,
                        layout: './main-layout'
                    })
            })

        })
    }
})

router.post('/editor/edit/:id', (req, res, next) => {
    var id = req.params.id;
    var temp = req.body;
    var dob = moment(temp.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var entity = {
        idThanhVien: id,
        HoTen: temp.ten,
        QuanLiCM: temp.CMQuanLi,
        Email: temp.email,
        NgaySinh: dob,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/editor')
})

router.post('/giaHan/:id', (req, res, next) => {
    var id = req.params.id;
    var day = new Date();
    var curDay = moment(day).format('YYYY/MM/DD');
    var die = new Date();
    die.setDate(die.getDate() + 7);
    var expire = moment(die, 'DD/MM/YYYY').format('YYYY-MM-DD')

    var entity = {
        idThanhVien: id,
        NgayKichHoat: curDay,
        NgayHetHan: expire,
        TinhTrang: 0
    }
    DGModel.update(entity).then(id => {
        res.redirect('/admin/QuanLiTaiKhoan/DocGia')
    });
})

module.exports = router;

