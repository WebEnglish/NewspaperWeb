var express = require('express');
var baibaoModal = require('../model/DSBaiBao');
var router = express.Router();

router.get('/:idBB', function (req, res) {
  var id = req.params.idBB;

  Promise.all([
    baibaoModal.newsdetail(id),
    baibaoModal.newstag(id),
    baibaoModal.comment(id),
    baibaoModal.relate(id)
  ]).then(([row, row1, row2, row3]) => {
    res.render('bai-bao', {
      detail: row,
      tagnews: row1,
      cmt: row2,
      relatebb: row3,
      layout: './main'
    });
  }).catch(err => {
    console.log(err);
    res.end('error occured!')
  });
});

router.post('/:idBB', function (req, res, next) {
  //console.log(req.body);
  var datetime = new Date();
  var id = req.params.idBB;
  var entity = {
    NoiDung: req.body.comment,
    BaiBao: id,
    NgayDang: datetime,
    NguoiBL: 1
  }


  Promise.all([
    baibaoModal.newsdetail(id),
    baibaoModal.newstag(id),
    baibaoModal.comment(id),
    baibaoModal.relate(id),
    baibaoModal.addComment(entity)
  ])
    .then( n => {
      res.redirect('back');
    })
    .catch(err => {
      console.log(err);
      res.end('error occured!')
    });
});

module.exports = router;