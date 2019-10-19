var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var db_str = "mongodb://localhost:27017/test";
var session = require('express-session');
var ObjectId = require('mongodb').ObjectId;
var async = require('async');

router.get('/', function(req, res, next) {
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('blog',(err,coll)=>{
			// coll.find().sort({_id:-1}).toArray((err,data)=>{
			// 	res.render('index',{data:data,username:req.session.username})
			// 	dbs.close();
			// })

			//页码
			var pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;00
			//总页数
			var page=0;
			//每页展示的数量
			var size = 3;
			//总数据量
			var count = 0;

			async.series([
				function(callback){
					coll.find({author:req.session.username}).toArray((err,result)=>{
						count = result.length;
						page = Math.ceil(count/size);
						pageNo=pageNo<=1?1:pageNo;
						callback(null,'')
						dbs.close()
					})
				},
				function(callback){
					coll.find({author:req.session.username}).sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,info)=>{
						callback(null,info)
						dbs.close()
					})
				}
			],(err,data)=>{
			//	res.render('/',{data:data[1],pageNo:pageNo,page:page})
				res.render('index',{data:data[1],pageNo:pageNo,page:page,username:req.session.username})
			})


		})
	})
});

router.get('/register', function(req, res, next) {
  res.render('register')
});

router.get('/login', function(req, res, next) {
  res.render('login')
});

router.get('/blog', function(req, res, next) {
	res.render('blog')
});
//详情页
router.get('/detail',(req,res)=>{
	let id = ObjectId(req.query.id);
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('blog',(err,coll)=>{
			coll.find({_id:id}).toArray((err,data)=>{
				res.render('detail',{detail:data[0],username:req.session.username});
			})
		})
	})
})

//退出登录
router.get('/relogin', function(req, res, next) {
	req.session.destroy((err)=>{
		if(err) throw err;
		res.redirect('/login')
	})
});

//校验token

module.exports = router;
