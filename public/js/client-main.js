// Must ensure that socket.io client is loaded prior
// to running this script.

// Open a Socket.IO connection with the server.
var socket = io();

function applyMessageBoxHeight() {
	var titleHeight = $(".container-title").outerHeight();
	var inputHeight = $(".container-input").outerHeight();
	var messagesHeight = $(document).outerHeight() - titleHeight - inputHeight;

	$(".container-messages").css("height", messagesHeight);
}

applyMessageBoxHeight();

function scrollToBottom($element) {
	if($element[0]) {
		var scrollHeight = $element[0].scrollHeight;
		if(scrollHeight && ($element.outerHeight() < scrollHeight)) {
			$element.scrollTop(scrollHeight);
		}
	}
}

function updateLayout($element) {
	applyMessageBoxHeight();
	scrollToBottom($element);
}

$(window).on("resize", function() {
	updateLayout($(".container-messages"));
});

/* SOCKET HANDLING */

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
	scrollToBottom($(".container-messages"));
});

$("form").submit(function() {
	if($("#msg-input").val()) {
		socket.emit("bepis-message", $("#msg-input").val());
		$("#msg-input").val("");
		$(".btn-send-message").blur();
		$("#msg-input").blur();
		updateLayout($(".container-messages"));
		return false;
	}
});

/* =============== */
