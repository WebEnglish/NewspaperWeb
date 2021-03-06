var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var exphbs  = require('express-handlebars');

 var moment = require('moment');
 var hbs_sections = require('express-handlebars-sections')

var app = express();
var morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());

//require('./middlewares/view-engine')(app);
require('./middlewares/session')(app);
require('./middlewares/passport')(app);

require('./middlewares/upload')(app);


app.engine('.hbs', exphbs({extname: '.hbs',
        helpers: {
        format: val => {
          return moment(val).format('DD/MM/YYYY');
        },
        section: hbs_sections() 
  }}));

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(require('./middlewares/view-engine'))

app.use(express.static(__dirname+'/public'));

app.use(require('./middlewares/auth-mdw'));

app.use(require('./middlewares/locals.mdw'));
app.use(require('./middlewares/writer.mdw'));
app.use(bodyParser());

app.use('/editor', require('./router/Editor'))
app.use('/writing', require('./router/writer'))
app.use('/admin', require('./router/admin/admin-router'))
app.use('/admin/QuanLiBaiBao', require('./router/admin/BaiBao-router'))
app.use('/admin/QuanLiTaiKhoan', require('./router/admin/QLTaiKhoan'))
app.use('/admin/QuanLiChuyenMuc', require('./router/admin/cate-router'))
app.use('/admin/QuanLiTheTag', require('./router/admin/tag-router'))
app.use('/account', require('./router/account'))

app.use('/', require('./router/DSBaiBao.router'))


//app.use('/:idCM', require('./router/baibaochitiet'))
// app.get('/home', function (req, res) {
//   res.render('home')
// });


app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
})
