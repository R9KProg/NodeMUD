var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function parseComm(msg) {
  function command(match, usage, type, action, data, reply) {
    this.match = match;
    this.usage = usage;
    this.type = type;
    this.action = action;
    this.data = data;
    this.reply = reply;
  }

  var say = new command(
    /^(say) (.*)/i,
    'say - Usage: \"say Something about Someone or something.\"',
    'global',
    '', '',
    '[chat] ' + msg.replace(/^(say) (.*)/, '$2')
  );
   
  var help = new command(
    /^help/i,
    'help - Display a list of all commands.',
    '',
    function() {
      for (i in data) {
        io.to(client).emit('message', data[i]['usage']);
      }
    },
    '', ''
  );

  var clear = new command(
    '',
    'clear - Clear all messages.',
    '', '', '', ''
  );

  var commands = [help, say, clear];

  help['data'] = commands;
  
  for (i in commands) {
    var c = commands[i];
    var re = {};
    if (c['match'].exec(msg) !== null) {
      if (c['data'] != '') {
        re.data = c['data'];
      }
      if (c['action'] != '') {
        re.action = c['action'];
      } 
      if (c['type'] != '') {
        re.type = c['type'];
        re.reply = c['reply'];
      }
      return re;
    }
  }
}

module.exports.parseComm = parseComm;
