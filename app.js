/* Main Server for the app */
var path = require("path");
var express = require("express");
var app = express();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

app.use(express.static(path.join(__dirname, "public")));

// ROUTES - may move routes into it's own module as the
// server API grows.
app.get("/", function(req, res) {
	res.sendFile("index.html");
});

// Socket listening events
// TO DO:
// - Handle broadcasting emitted client events
// - There will be more crap to do.
io.on("connection", function(socket) {
	console.log("A client connected!");
	socket.emit("bepis-message", "Server: Connection Established!");
	socket.on("disconnect", function() {
		console.log("A client disconnected!");
	});
	
	socket.on("bepis-message", function(msg) {
		io.emit("bepis-message", msg);
	});
});



// Begin listening for incoming requests - default is 3000
var port = process.env.PORT || 3000;
httpServer.listen(process.env.PORT || 3000, function() {
	console.log("Bepis Chat - Server started @ PORT " + port);
});