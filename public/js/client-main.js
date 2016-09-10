// Must ensure that socket.io client is loaded prior
// to running this script.

// Open a Socket.IO connection with the server.
var socket = io();

$("form").submit(function() {
	if($("#msg-input").val()) {
		socket.emit("bepis-message", $("#msg-input").val());
		$("#msg-input").val("");
		return false;
	}
});

socket.on("connect", function() {
	$("#connection-status").text("Status: Connected");
});

socket.on("disconnect", function() {
	$("#connection-status").text("Status: Disconnected");
});

socket.on("bepis-message", function(msg) {
	$("#container-messages").append($("<li>").text(msg));
});