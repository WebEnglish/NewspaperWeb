
var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var passport = require('passport');
var userModel = require('../model/User-model');
var auth = require('../middlewares/auth');
var randomstring = require("randomstring");

var nodemailer = require('nodemailer')
var router = express.Router();
router.get('/is-available', (req, res, next) => {
    var email = req.query.email;
    userModel.singleByUserName(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})



// function addDays(dateObj, numDays) {
//     dateObj.setDate(dateObj.getDate() + numDays);
//     return dateObj;
// }

router.get('/register', (req, res, next) => {
    if (!req.user) {
        res.render('VAccount/register', {
            layout: './main'
        });
    }
    else {
        res.redirect('/home')
    }

})

router.post('/register', (req, res, next) => {
    //var entity = new Object;
    var saltRounds = 10;
    //var entity = req.body;
    var todays = new Date();
    var die = new Date();
    die.setDate(die.getDate() + 7);
    //var die = setDate(todays.getDate() + numDays);

    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    //console.log(hash);
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
        NgayHetHan: expire,
        KeyPass: randomstring.generate(10),
        Xoa: 0
    }
    userModel.add(entity).then(id => {
        res.redirect('/account/login');
    })
})

router.get('/login', (req, res, next) => {
    if (!req.user) {
        res.render('VAccount/login', {
            layout: './main'
        });
    }
    else {
        res.redirect('/home')
    }

})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            return res.render('VAccount/login.hbs', {
                err_message: info.message,
                layout: './main'
            })
        }

        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            if (req.user.PhanHe == 4) {
                return res.redirect('/admin')
            }
            else {
                return res.redirect('/home');
            }
        });
    })(req, res, next);

})

router.post('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/account/login')
})

router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/account/login')
})

router.get('/profile', auth, (req, res, next) => {
    // if (req.user.PhanHe == 4) {
    //     res.render('VAccount/profile', {
    //         layout: './main-layout'
    //     })
    // }
    // else {
    var isWriter = false;
    var isEditor = false;
    var isUser = false;
    var currentDay = new Date();
    var day = moment(currentDay).format('YYYY/MM/DD');
    var nhh = moment(req.user.NgayHetHan).format('YYYY/MM/DD');
    var hethan = false;
    if (nhh < day && req.user.TinhTrang == 1) {
        var hanDung = 'Đang chờ gia hạn';
    }
    else if (nhh < day && req.user.TinhTrang == 0) {
        hethan = true;
        var hanDung = 'Đã hết hạn';
    }
    else {
        var hanDung = moment(req.user.NgayHetHan).format('DD/MM/YYYY');
    }
    var dob = moment(req.user.NgaySinh).format('DD/MM/YYYY')
    switch (req.user.PhanHe) {
        case 1: isUser = true; break;
        case 2: isWriter = true; break;
        case 3: isEditor = true; break;
    }
    res.render('VAccount/profile', {
        user: req.user,
        dob: dob,
        isWriter: isWriter,
        isEditor: isEditor,
        hanDung: hanDung,
        isUser: isUser,
        hethan: hethan,
        layout: './main'
    })
    // }

})

router.post('/profile', (req, res, next) => {
    var infor = req.body;
    var dob = moment(infor.dob, 'DD/MM/YYYY').format('YYYY/MM/DD')
    var entity = {
        idThanhVien: req.user.idThanhVien,
        HoTen: infor.HoTen,
        Email: infor.Email,
        ButDanh: infor.ButDanh,
        NgaySinh: dob
    }
    req.user.NgaySinh = infor.dob;
    req.user.ButDanh = infor.ButDanh;
    req.user.HoTen = infor.HoTen;
    req.user.Email = infor.Email;
    userModel.updatetk(entity);
    // if (req.user.PhanHe == 4) {
    //     res.redirect('/admin');
    // }
    // else {
    res.redirect('/');
    // }

})

router.get('/doimatkhau', auth, (req, res) => {

    // if (req.user.PhanHe == 4) {
    //     res.render('VAccount/DoiMatKhau', {
    //         layout: './main-layout'
    //     })
    // }
    // else {
    res.render('VAccount/DoiMatKhau', {
        layout: './main'
    })
    // }

})

router.post('/doimatkhau', (req, res, next) => {

    var idtk = req.user.idThanhVien;
    var infor = req.body;
    var ret = bcrypt.compareSync(infor.oldPass, req.user.MatKhau);
    if (ret) {
        var hash = bcrypt.hashSync(infor.newPass, 10);
        var dungPass = true;
        var entity = {
            idThanhVien: idtk,
            MatKhau: hash
        }
        req.user.MatKhau = hash;
        userModel.updatetk(entity);
        // if (req.user.PhanHe == 4) {
        //     res.render('VAccount/DoiMatKhau', {
        //         dungPass: dungPass,
        //         layout: './main-layout'
        //     })
        // } else {
        res.render('VAccount/DoiMatKhau', {
            dungPass: dungPass,
            layout: './main'
        })
        // }

    }
    else {
        // if (req.user.PhanHe == 4) {
        //     var saiPass = true;
        //     res.render('VAccount/DoiMatKhau', {
        //         saiPass: saiPass,
        //         layout: './main-layout'
        //     })
        // }
        // else {
        var saiPass = true;
        res.render('VAccount/DoiMatKhau', {
            saiPass: saiPass,
            layout: './main'
        })
        // }
    }
})


router.get('/getnewpassword', (req, res) => {
    if (!req.user) {
        res.render('VAccount/GetNewPass', {
            layout: './main'
        })
    }
    else {
        res.redirect('/home')
    }
})

router.post('/getnewpassword', (req, res) => {
    var mail = req.query.email;
    var pass = req.body.NewPass;
    var hash = bcrypt.hashSync(pass, 10);
    userModel.singleByUserName(mail).then(row => {
        var entity = {
            idThanhVien: row[0].idThanhVien,
            MatKhau: hash,
        }
        userModel.updatetk(entity).then(id => {
            res.redirect('/account/login');
        })
    })
})


router.post('/QuenMatKhau', function (req, res, next) {
    var email = req.body.email;
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'lehung03091997@gmail.com',
            pass: '0309hung'
        }
    });

    var user = new Object();
    userModel.singleByUserName(email).then(row => {
        if (row.length > 0) {
            var url = 'http://localhost:3000/account/getnewpassword?email=' + email + '&key=' + row[0].KeyPass;
            var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                from: 'AH!BreakingNews',
                to: email,//đến đâu
                subject: 'Email lấy lại mật khẩu từ báo điện tử AH!BreakingNews',
                html: '<p>Đây là thông tin bảo mật, đừng để nó public ra ngoài</p></br><a href="' + url + '"><b>Click here to reset password</b></a>',
            }
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    res.redirect('/account/login');
                } else {
                    console.log('Message sent: ' + info.response);
                    res.redirect('/account/login');
                }
            });
        }
        else{
         res.redirect('/account/login')
        }

    });
});

router.get('/giahan', (req, res) => {
    var id = req.user.idThanhVien;
    var entity = {
        idThanhVien: id,
        TinhTrang: 1
    }
    req.user.TinhTrang = 1;
    userModel.updatetk(entity).then(id => {
        res.redirect('/account/profile');
    })
})




module.exports = router;