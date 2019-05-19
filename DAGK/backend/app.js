var express = require('express');
var exphbs  = require('express-handlebars');


var app = express();

app.engine('hbs', exphbs({
  layoutsDir: 'views/layouts',
  defaultLayout: 'index.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname+'/public'));
app.use(require('./middlewares/locals.mdw'));
  
// app.use('/', require('./routes/admin/category.route'))
// app.use('/pr/a', require('./routes/admin/category.route'))
//  app.use('/', require('./routes/SanPham'))

app.use('/', require('./router/DSBaiBao.router'))
app.get('/', function (req, res) {
    res.render('a')
});  



app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
})