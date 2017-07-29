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
			name:data.name,
			icon:data.icon
		});
		user.save(function (err){
			if(err){
				console.log('数据插入失败！');
			} else {
				console.log('数据插入成功！');
			}
		});
		io.emit('login' , data );
	});
	socket.on('disconnect', function(reason) {
		console.log(socket.id);
		// if(chatname != ''){
			// console.log(data.name);
			// Users.remove({name:data.name},function(err){
			// 	if(err){
			// 		console.log(data.name+'删除用户失败！');
			// 	} else {
			// 		console.log(data.name+'删除用户成功！');
			// 	}
			// })
		// }
	    
	});
})

exports.listen = function(server){
	io.listen(server);
}