var express = require('express');
var writerModal = require('../model/Forwriter');
var router = express.Router();
var alert = require('alert-node');;

router.get('/',(req,res) => {
    res.render('editor/index-editor',{
        layout: './main'
    })
})

module.exports = router;