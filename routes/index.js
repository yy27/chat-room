var express = require('express');
var mongoose = require('mongoose');//导入mongoose模块
var Users = require('../schemas/user');
// var Users = require('../models/user');//导入模型数据模块

var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
	Users.fetch(function(err, users) {
        if(err) {
            console.log(err);
        }        
        res.render('index/index',{title: '用户列表', users: users})  //这里也可以json的格式直接返回数据res.json({data: users});
    })
	// res.render('index/index', { title: 'Express'});

});

module.exports = router;
