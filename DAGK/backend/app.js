var express = require('express');
var exphbs  = require('express-handlebars');
var moment = require('moment');
var hbs_sections = require('express-handlebars-sections')


var app = express();

app.engine('hbs', exphbs({
  layoutsDir: 'views/layouts',
  defaultLayout: 'main.hbs',
  helpers: {
    format: val => {
      return moment(val).subtract(10, 'days').calendar();
    },
    section: hbs_sections() 
  }
}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname+'/public'));
app.use(require('./middlewares/locals.mdw'));
  
// app.use('/', require('./routes/admin/category.route'))
// app.use('/pr/a', require('./routes/admin/category.route'))
//  app.use('/', require('./routes/SanPham'))
app.use('/account', require('./router/account'))
app.use('/', require('./router/DSBaiBao.router'))
app.get('/', function (req, res) {
    res.render('home')
});

app.use('/:idCM', require('./router/baibaochitiet'))
// app.get('/home', function (req, res) {
//   res.render('home')
// });


app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
})
