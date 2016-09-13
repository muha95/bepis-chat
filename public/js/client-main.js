// Must ensure that socket.io client is loaded prior
// to running this script.

// Open a Socket.IO connection with the server.
var socket = io();

$("form").submit(function() {
	if($("#msg-input").val()) {
		socket.emit("bepis-message", $("#msg-input").val());
		$("#msg-input").val("");
		$(".btn-send-message").blur();
		return false;
	}
});

applyMessageBoxHeight();

function applyMessageBoxHeight() {
	var titleHeight = $(".container-title").outerHeight();
	var inputHeight = $(".container-input").outerHeight();
	var messagesHeight = $(document).outerHeight() - titleHeight - inputHeight;
	
	$(".container-messages").css("height", messagesHeight);
}

$(window).on("resize", function() {
	applyMessageBoxHeight();
});

socket.on("connect", function() {
	$("#connection-status").text("Connected");
	$("#connection-status").removeClass("label-danger");
	$("#connection-status").addClass("label-success");
});

socket.on("disconnect", function() {
	$("#connection-status").text("Disconnected");
	$("#connection-status").removeClass("label-success");
	$("#connection-status").addClass("label-danger");
});

socket.on("bepis-message", function(msg) {
	$("#message-list").append($("<li>").text(">	 " + msg));
});

