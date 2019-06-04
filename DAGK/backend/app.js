var express = require('express');
var bodyParser = require('body-parser')
var app = express();

require('./middlewares/view-engine')(app);
require('./middlewares/passport')(app);
require('./middlewares/session')(app);

//app.use(require('./middlewares/view-engine'))
app.use(express.static(__dirname+'/public'));
app.use(require('./middlewares/locals.mdw'));
app.use(bodyParser());

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
