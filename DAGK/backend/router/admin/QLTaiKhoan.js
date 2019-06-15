var express = require('express');
var moment = require('moment');
var bcrypt = require('bcrypt');
var DGModel = require('../../model/admin/TKDocGia-model');
var router = express.Router();

router.get('/DocGia', (req, res) => {
    DGModel.all().then(rows => {
        var isdocgia = true;
        var dem = 0;
        var i = 0;
        for (const c of rows) {
            dem += 1;
            rows[i].stt = dem;
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

})

router.get('/DocGia/delete/:id', (req, res, nexr) => {
    var id = req.params.id;
    var entity = {
        idThanhVien: id,
        Xoa: 1,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/DocGia');
})

router.get('/DocGia/AddDG', (req, res, nexr) => {
    res.render('admin-hbs/DocGia/AddDocGia', {
        layout: './main-layout'
    })

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

router.get('/DocGia/edit/:id', (req, res, nexr) => {
    var id = req.params.id;
    var isdocgia = true;
    DGModel.GetTKbyID(id).then(row => {
        res.render('admin-hbs/DocGia/DetailTK', {
            isdocgia: isdocgia,
            docgia: row[0],
            layout: './main-layout'
        })
    })

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

router.get('/writer', (req, res) => {
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
})

router.get('/writer/Add', (req, res, nexr) => {
    var writer = true;
    res.render('admin-hbs/DocGia/AddDocGia', {
        writer: writer,
        layout: './main-layout'
    })
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

router.get('/writer/delete/:id', (req, res, nexr) => {
    var id = req.params.id;
    var entity = {
        idThanhVien: id,
        Xoa: 1,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/writer');
})

router.get('/writer/edit/:id', (req, res, nexr) => {
    var iswriter = true;
    var id = req.params.id;
    DGModel.GetTKbyID(id).then(row => {
        res.render('admin-hbs/DocGia/DetailTK', {
            iswriter: iswriter,
            docgia: row[0],
            layout: './main-layout'
        })
    })
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

router.get('/editor', (req, res) => {
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

})


router.get('/editor/add', (req, res, nexr) => {
    DGModel.allCMCap2().then(rows => {
        var iseditor = true;
        res.render('admin-hbs/DocGia/AddDocGia', {
            chuyenMuc: rows,
            iseditor: iseditor,
            layout: './main-layout'
        })
    })


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

router.get('/editor/delete/:id', (req, res, nexr) => {
    var id = req.params.id;
    var entity = {
        idThanhVien: id,
        Xoa: 1,
    }
    DGModel.update(entity);
    res.redirect('/admin/QuanLiTaiKhoan/editor');
})

router.get('/editor/edit/:id', (req, res, nexr) => {
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


module.exports = router;

