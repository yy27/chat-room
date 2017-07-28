var io = require('socket.io')();

io.on('connection',function(socket){
	console.log("连接建立");
	socket.on('chat message' , function(data){
		io.emit('chat message' , data );
	});
	socket.on('login' , function(data){
		io.emit('login' , data );
	});
})

exports.listen = function(server){
	io.listen(server);
}