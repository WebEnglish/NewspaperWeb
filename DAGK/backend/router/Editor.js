var express = require('express');
var editorModel = require('../model/Editor-model');
var moment = require('moment');
var writerModal = require('../model/Forwriter');
var router = express.Router();
var alert = require('alert-node');;


router.get('/', (req, res) => {
    editorModel.bbByidTV(req.user.idThanhVien).then(row => {
        var dem = 0;
        var i = 0;
        for (const c of row) {
            dem += 1;
            row[i].stt = dem;
            i += 1;
        }
        res.render('editor/index-editor', {
            BaiBao: row,
            layout: './main'
        })
    })
})

router.get('/detail/:id', (req, res) => {
    var id = req.params.id;
    editorModel.getNDById(id).then(row => {
        res.render('editor/detailBB', {
            NoiDung: row[0],
            layout: './main'
        })
    })
});

router.post('/:id', (req, res) => {
    var id = req.params.id;
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var entity = {
      idBaiBao : id,
      NgayXuatBan: dob,
      TrangThai : 2,
    }
    writerModal.update(entity);
    res.redirect('/editor')
});

router.get('/daxuli',(req,res) => {
    editorModel.getListXuLi(req.user.idThanhVien).then(row => {
        var dem = 0;
        var i = 0;
        for (const c of row) {
            dem += 1;
            row[i].stt = dem;
            i += 1;
        }
        res.render('editor/ListDaXuLi', {
            BaiBao: row,
            layout: './main'
        })
    })
})




module.exports = router;