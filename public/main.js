var socket = io();
 
$('form').submit(function () {
    var say = $('#message').val().replace(/^(say) (.*)/, '$2')
    if (say != $('#message').val()) {
        socket.emit('chat message', say);
        $('#message').val('');
    }
    else if ($('#message').val() == "clear") {
        document.getElementById("messages").innerHTML = '';
        $('#message').val('');
    }
    else {
        $('#messages').append("<li>Invalid command.</li>");
        $('#message').val('');
    }
    return false;
});
 
socket.on('message', function (msg) { 
    $('#messages').append('<p>' + msg + '</p><br/>');
});
