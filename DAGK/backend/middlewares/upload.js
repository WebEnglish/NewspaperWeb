
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/adimages');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
   
  var upload = multer({ storage });

module.exports = function (app) {
  app.post('/upload',upload.single('adas'),(req,res,next)=>{
        if(err){
            return res.json({
                error: err.message
            });
        }
        res.json({});
  })
}