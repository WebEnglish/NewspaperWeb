
var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var passport = require('passport');
var userModel = require('../model/User-model');
var auth = require('../middlewares/auth');

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
    res.render('VAccount/register', {
        layout: './main'
    });
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
        NgayHetHan: expire
    }
    userModel.add(entity).then(id => {
        res.redirect('/account/login');
    })
})

router.get('/login', (req, res, next) => {
    res.render('VAccount/login', {
        layout: './main'
    });
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
            return res.redirect('/');
        });
    })(req, res, next);

})

router.get('/pro', auth, (req, res, next) => {
    res.end('avaaad');
})

router.post('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/account/login')
})

router.get('/profile', (req, res, next) => {
    var isWriter = false;
    var isEditor = false;
    var isUser = false;
    switch (req.user.PhanHe) {
        case 1: isUser = true; break;
        case 2: isWriter = true; break;
        case 3: isEditor = true; break;
    }
    res.render('VAccount/profile', {
        user: req.user,
        isWriter: isWriter,
        isEditor: isEditor,
        isUser: isUser,
        layout: './main'
    })
})

// router.post('/send', function(req, res, next) {
//     var transporter =  nodemailer.createTransport({ // config mail server
//         service: 'Gmail',
//         auth: {
//             user: 'lehung03091997@gmail.com',
//             pass: '0309hung'
//         }
//     });
//     var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
//         from: 'Thanh Batmon',
//         to: '@gmail.com',
//         subject: 'Test Nodemailer',
//         html: '<a href="">You have got a new message</b><ul><li>Username: ' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Username:' + req.body.message + '</li></ul>'
//     }
//     transporter.sendMail(mainOptions, function(err, info){
//         if (err) {
//             console.log(err);
//             res.redirect('/');
//         } else {
//             console.log('Message sent: ' +  info.response);
//             res.redirect('/');
//         }
//     });
// });




module.exports = router;