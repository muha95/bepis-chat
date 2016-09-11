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
	$("#connection-status").addClass("connection-status-connected");
});

socket.on("disconnect", function() {
	$("#connection-status").text("Status: Disconnected");
	$("#connection-status").removeClass("connection-status-connected");
});

socket.on("bepis-message", function(msg) {
	$("#message-list").append($("<li>").text(">	 " + msg));
});