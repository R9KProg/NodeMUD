var socket = io();

var span = $('<span>').css('display','inline-block')
.css('word-break','break-all').appendTo('body').css('visibility','hidden');
function initSpan(textarea){
  span.text(textarea.text())
      .width(textarea.width())      
      .css('font',textarea.css('font'));
}
$('textarea').on({
    input: function(){
      var text = $(this).val();      
      span.text(text);      
      $(this).height(text ? span.height() : '1.1em');
    },
    focus: function(){
     initSpan($(this));
    },
    keypress: function(e){
        if(e.which == 13) {
        	e.preventDefault();
            
            $('#messages').append('<p>' + $('#message').val() + '</p><br/>'); 

            var say = $('#message').val().replace(/^(say) (.*)/, '$2');
            if (say != $('#message').val()) {
                socket.emit('chat message', say);
            }
            else if ($('#message').val() == "clear") {
                $('#messages').empty();
            }
            else if ($('#message').val() == "help") {
                $('#messages').append("<p>List of available commands:<br/>help - This command.<br/>say - Global chat. Usage: say something about something<br/>clear - Clear all messages.</p><br/>");
            }
            else {
                $('#messages').append("<p>Invalid command. Type \"help\" for a list of available commands.</p><br/>");
            }
            $('#message').val('');
            return false;
        }
    }
});

socket.on('message', function (msg) { 
    $('#messages').append('<p>' + msg + '</p><br/>');
});
