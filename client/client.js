var socket = io();

var span = $('<span>').css('display','inline-block')
  .css('word-break','break-all').appendTo('body').css('visibility','hidden');
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
    if(e.which == 13) {
    e.preventDefault();

    // Echo user submitted message.
    $('#messages').append('<p>' + $('#message').val() + '</p><br/>');

    // Submit to server.
    socket.emit('m', $('#message').val());

    // Clear input.
    $('#message').val('');
    }
  }
});

socket.on('message', function (msg) { 
  $('#messages').append('<p>' + msg + '</p><br/>');
});
