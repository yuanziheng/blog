var multiparty=require('multiparty')
var fs=require('fs')
function upload(req,res){
//	创建表单
	var form =new multiparty.Form()
//	编码格式
	form.encoding='utf-8';
//	文件大小
	form.maxFilesSize=2*1024*1024;
//	文件上传目录
	form.uploadDir='./uploadtem';
	
	
	form.parse(req,function(err,fields,files){
		var uploadurl='/images/upload';
//		获取文件
		file=files['filedata'];
//		文件的原始名字
		originalFilename=file[0].originalFilename;
//		文件路径
		tempath=file[0].path;
		
		var timestap=new Date().getTime()
		uploadurl+=timestap+originalFilename;
		newPath='./public/'+uploadurl;
		
		var fsread=fs.createReadStream(tempath)
		var fswrite=fs.createWriteStream(newPath)
		
		fsread.pipe(fswrite)
		fswrite.on('close',()=>{
			fs.unlinkSync(tempath)
			res.send('{"err":"","msg":"'+uploadurl+'"}')	
		})	
	})
}

module.exports=upload;