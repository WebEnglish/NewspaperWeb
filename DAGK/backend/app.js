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
require('./middlewares/passport')(app);
require('./middlewares/session')(app);

app.engine('.hbs', exphbs({extname: '.hbs',
        helpers: {
        format: val => {
          return moment(val).subtract(10, 'days').calendar();
        },
        section: hbs_sections() 
  }}));

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(require('./middlewares/view-engine'))

app.use(require('./middlewares/auth-mdw'));
app.use(express.static(__dirname+'/public'));
app.use(require('./middlewares/locals.mdw'));
app.use(bodyParser());

app.use('/admin', require('./router/admin/admin-router'))
app.use('/admin/QuanLiChuyenMuc', require('./router/admin/cate-router'))

app.use('/account', require('./router/account'))
app.use('/', require('./router/DSBaiBao.router'))


app.use('/:idCM', require('./router/baibaochitiet'))
// app.get('/home', function (req, res) {
//   res.render('home')
// });


app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
})
