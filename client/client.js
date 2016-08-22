var socket = io();

var span = $('<span>').css('display','inline-block')
  .css('word-break','break-all').appendTo('body').css('visibility','hidden');

// User command history.
var userHistory = [];
var position = 0;

function initSpan(textarea) {
  span.text(textarea.text())
    .width(textarea.width())      
    .css('font',textarea.css('font'));
}
$('textarea').on({
  input: function() {
    var text = $(this).val();      
    span.text(text);      
    $(this).height(text ? span.height() : '1.1em');
  },
  focus: function() {
    initSpan($(this));
  },
  keypress: function(e) {
    if (e.which == 13) {
      e.preventDefault();

      // Echo user submitted message.
      $('#messages').append('<p>' + $('#message').val() + '</p><br/>');
      // Add command to message history.
      userHistory.push($('#message').val());
      // Set position back to last entered command.
      position = userHistory.length - 1;

      // Submit to server.
      if ($('#message').val() == 'clear') {
        $('#messages').empty();
      }
      else {
        socket.emit('m', $('#message').val());
      }
      // Clear input.
      $('#message').val('');
    }
  },
  keydown: function(e) {
    if (e.which == 38) {
      $('#message').val(userHistory[position]);
      position--;
    }
    else if (e.which == 40) {
      $('#message').val(userHistory[position]);
      position++;
    }
  }
});

socket.on('message', function (msg) { 
  $('#messages').append('<p>' + msg + '</p><br/>');
});
