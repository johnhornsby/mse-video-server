var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('get video data', function () {
    // no encoding of buffer, read it raw
  	fs.readFile(__dirname + '/test.webm', function(err, data) {
  		if (err) {
  			console.log(err);
  		} else {
        // send the raw data, (ArrayBuffer)
  			socket.emit('receive video data', {buffer: data})
  		}
  	});
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});