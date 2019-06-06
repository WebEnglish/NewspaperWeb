
var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var passport = require('passport');
var userModel = require('../model/User-model');
var au = require('../middlewares/auth');

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

function addDays(dateObj, numDays) {
    dateObj.setDate(dateObj.getDate() + numDays);
    return dateObj;
}

router.get('/register', (req, res, next) => {
    res.render('VAccount/register',{
        layout: './main'
    });
})

router.post('/register', (req, res, next) => {
    //var entity = new Object;
    var saltRounds = 10;
    var entity = req.body;
    var todays = new Date();
    var die = new Date();
    die.setDate(die.getDate() + 30);
    //var die = setDate(todays.getDate() + numDays);
    
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    console.log(hash);
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var date = moment(todays,'DD/MM/YYYY').format('YYYY-MM-DD') 
    var expire = moment(die,'DD/MM/YYYY').format('YYYY-MM-DD')
    var entity = {
        HoTen: req.body.fullName,
        NgaySinh: dob,
        Email: req.body.email,
        MatKhau: hash,
        PhanHe: 1 ,
        NgayKichHoat: date,
        NgayHetHan: expire
    }
    userModel.add(entity).then(id => {
        res.redirect('/account/login');
    })
})

router.get('/login', (req, res, next) => {
    res.render('VAccount/login.hbs',{
    layout: './main'
    });
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, email, info) => {
        if (err)
            return next(err);

        if (!email) {
            return res.render('VAccount/login.hbs', {              
                err_message: info.message,
                layout: './main'
            })
        }
       
        req.logIn(email, err => {
            if (err)
                return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
    
})

router.get('/pro', au,  (req, res, next) => {
    res.end('avaaad');
})


module.exports = router;