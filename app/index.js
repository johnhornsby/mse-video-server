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

    const startTime = new Date().getTime();

    console.log(startTime);

  	fs.readFile(__dirname + '/test.webm', function(err, data) {
  		if (err) {
  			console.log(err);
  		} else {
        // send the raw data, (ArrayBuffer)

        console.log('ArrayBuffer length: ' + data.length);

        data = data.slice(0, Math.floor(data.length / 5));

        const time = new Date().getTime() - startTime;

        console.log('read file in ' + time + 'ms');

        console.log('ArrayBuffer now length: ' + data.length);

        cb({buffer: data});
  		}
  	});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});