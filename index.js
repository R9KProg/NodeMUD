var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var comm = require('./server/commands.js');

app.use(express.static('client'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  io.to(socket.id).emit('message', "Connection successful.");
  socket.on('m', function(msg) {
    var parsed = comm.parseComm(msg);
    if (parsed['type'] !== null) {
      if (parsed['type'] == 'global') {
        io.emit('message', parsed['reply']);
      }
      else if (parsed['type'] == 'client') {
        io.to(socket.id).emit('message', parsed['reply']);
      }
    }
    if (parsed['action'] !== null) {
      parsed['action'];
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
