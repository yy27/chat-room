var Users = require('./schemas/user');
var io = require('socket.io')();
var mongoose = require('mongoose');//导入mongoose模块
io.on('connection',function(socket){
	console.log("连接建立");
	socket.on('chat message' , function(data){
		io.emit('chat message' , data );
	});
	socket.on('login' , function(data){
		user = new Users({
			sid:socket.id,
			name:data.name,
			icon:data.icon,
			color:data.color,
		});
		user.save(function (err){
			if(err){
				console.log('数据插入失败！');
			} else {
				data.sid = socket.id;
				console.log('数据插入成功！');
				io.emit('login' , data );
			}
		});
		
	});
	socket.on('disconnect', function() {
		console.log(socket.id);
		Users.findOne({sid:socket.id}).exec(function (err,user){
			Users.remove({sid:socket.id},function(err){
				if(err){
					console.log('删除用户失败！');
				} else {
					console.log('删除用户成功！');
					io.emit('exit',{'sid':socket.id,'name':user.name});
				}
			});
		});
		

	    
	});
})

exports.listen = function(server){
	io.listen(server);
}