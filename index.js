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
  var client = socket.id;
  io.to(client).emit('message', "Connection successful.");
  socket.on('m', function(msg) {
    var parsed = comm.parseComm(msg);
    if (parsed['data'] != null) {
      var data = parsed['data'];
    }
    if (parsed['type'] != null) {
      if (parsed['type'] == 'global') {
        io.emit('message', parsed['reply']);
      }
      else if (parsed['type'] == 'client') {
        io.to(client).emit('message', parsed['reply']);
      }
    }
    if (parsed['action'] != null) {
      eval("var action = " + parsed['action'].toString());
      delete(parsed['action']);
      action();
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
