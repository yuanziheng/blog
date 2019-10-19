var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/test";
var session = require('express-session');
var ObjectId = require('mongodb').ObjectId;
var jwt = require('jsonwebtoken');
var upload = require('./upload');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//注册
router.post('/register',function(req,res){
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('user',(err,coll)=>{
			coll.find({username:req.body.username}).toArray((err,data)=>{
				if(data.length>0){
					res.json({msg:'用户名已存在'});
					dbs.close();
				}else{
					coll.insert(req.body,(err)=>{
						res.json({msg:'success'});
						dbs.close();
					})
				}
			})
		})
	})
})

//登录
router.post('/login',(req,res)=>{
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('user',(err,coll)=>{
			coll.find(req.body).toArray((err,data)=>{
				if(data.length>0){
					let content = {name:req.body.username};//主题
					let miyao = 'jwt';
					let token = jwt.sign(content,miyao,{expiresIn:60*10*1})

					req.session.username=req.body.username
					res.json({msg:'success',token:token,username:req.body.username})
					dbs.close();
				}else{
					res.json({msg:'用户名或密码错误'})
					dbs.close();
				}
			})
		})
	})
})
//bolg
router.post('/blog',(req,res)=>{
	console.log(req.session.name)
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('blog',(err,coll)=>{
			coll.insert(req.body,()=>{
				res.json({msg:'success',author:req.session.username})
				dbs.close();
			})
		})
	})
})

router.post('/detail',(req,res)=>{
	let id = ObjectId(req.body.id)
	mongodb.connect(db_str,(err,dbs)=>{
		dbs.collection('blog',(err,coll)=>{
			coll.remove({_id:id})
			res.json({msg:"success"})
			dbs.close()
		})
	})
})

router.post('/uploadImg',(req,res)=>{
	upload(req,res)
})

module.exports = router;
