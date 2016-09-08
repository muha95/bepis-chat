/* Main Server for the app */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

// ROUTES - may move routes into it's own module as the
// server API grows.
app.get("/", function(req, res) {
	res.send("<h1>Bepis Chat - nothing to see here (yet)</h1>");
});

// Socket listening events
// TO DO:
// - Handle broadcasting emitted client events
// - There will be more crap to do.
io.on("connection", function(socket) {
	console.log("A client connected!");
	socket.on("disconnect", function() {
		console.log("A client disconnected!");
	});
});

// Begin listening for incoming requests - default is 3000
var port = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, function() {
	console.log("Bepis Chat - Server started @ PORT " + port);
});