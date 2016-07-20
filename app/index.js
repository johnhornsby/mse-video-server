var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('get video data', function (cb) {
    // no encoding of buffer, read it raw
    console.log('get video data');

  	fs.readFile(__dirname + '/test.webm', function(err, data) {
  		if (err) {
  			console.log(err);
  		} else {
        // send the raw data, (ArrayBuffer)
        cb({buffer: data});
  		}
  	});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});