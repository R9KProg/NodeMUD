var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function parseComm(msg) {
  function command(match, usage, type, action, reply) {
    this.match = match;
    this.usage = usage;
    this.type = type;
    this.action = action;
    this.reply = reply;
  }

  var say = new command(
    /^(say) (.*)/,
    'say - Usage: \"say Something about Someone or something.\"',
    'global',
    '',
    '[chat] ' + msg.replace(/^(say) (.*)/, '$2')
  );

  var commands = [say];
  
  for (i in commands) {
    var c = commands[i];
    var re = {};
    if (c['match'].exec(msg) !== null) {
      if (c['action'] != '') {
        re.push(c['action']);
      }
      if (c['type'] != '') {
        re.type = c['type'];
        re.reply = c['reply'];
      }
    }
    return re;
  }
}

module.exports.parseComm = parseComm;
