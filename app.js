/* Main Server for the app */
var path = require("path");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

if(process.argv[2]) {
	process.env.MONGODB_URI = process.argv[2];
} else if(!process.env.MONGODB_URI) {
	process.env.MONGODB_URI = "mongodb://localhost:27017/bepis";
}

console.log(`Connecting to MongoDB @ ${process.env.MONGODB_URI}...`);

mongoose.connect(process.env.MONGODB_URI, function(err) {
	if(err) {
		console.error("ERROR: Unable to connect to mongodb!");
		console.error(err);
		console.error("Terminating server...");
		process.exit(1);
	} else {
		console.log("MongoDB connected successfully!");
	}
});

var app = express();
// Initialise a httpServer instance with the express instance
// This is used to instantiate the socket.io library for the server.
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

var cookieOptions = {
	httpOnly: app.get("env") !== "production",
	secure: app.get("env") === "production",
	maxAge: 3600 * 12 * 1000
};

app.use(session({
	secret: "1234567890KBMD", // Key used to sign the cookie
	resave: false, // Don't force-save session data
	saveUninitialized: false, // Don't save an uninit'd session
	cookie: cookieOptions
	// name - option is used for the cookie's name
	// it is defaulted to connect.sid

	// genid - option is used to generate the session id
	// by default uid-safe.genuuid() is used

	// store - option is defaulted to a new MemoryInstance
	// this is not good for production env. as it's
	// prone to memory leaks
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

// ROUTES - may move routes into it's own module as the
// server API grows.
var usersRouter = require(path.join(__dirname, "app", "routes", "user.controller.js"))(mongoose);

app.use("/", usersRouter);

// Socket listening events
// TO DO:
// - Handle broadcasting emitted client events
// - There will be more crap to do.
io.on("connection", function(socket) {
	console.log("A client connected! - " + socket.handshake.address);

	socket.emit("bepis-message", "Server: Connection Established!");

	socket.on("disconnect", function() {
		console.log("A client disconnected! - " + socket.handshake.address);
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
