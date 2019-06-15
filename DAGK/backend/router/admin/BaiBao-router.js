var express = require('express');
var userCate = require('../../model/admin/ChuyenMuc');
var BBModel = require('../../model/admin/QLBaiBao');
var router = express.Router();

router.get('/', (req, res) => {

    BBModel.GetTTByID().then(row1 => {
        var dem = 0;
        var i = 0;
        for (const c of row1) {
            dem += 1;
            row1[i].stt = dem;
            i += 1;
        }

        res.render('admin-hbs/BaiBao/QLBaiBao', {
            dsBaiBao: row1,
            layout: './main-layout'
        })
    })

})

router.get('/delete/:id', (req, res) => {
    var id = req.params.id;
    var entity = {
        idBaiBao: id,
        Xoa: 1,
    }
    BBModel.update(entity);
    res.redirect('/admin/QuanLiBaiBao');
})



module.exports = router;

