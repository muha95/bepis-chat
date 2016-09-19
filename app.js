/* Main Server for the app */
var path = require("path");
var express = require("express");
var app = express();
var session = require("express-session");
var bodyParser = require("body-parser");

var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

var cookieOptions = {
	httpOnly: app.get("env") !== "production",
	secure: app.get("env") === "production",
	maxAge: 3600 * 12 * 1000
}

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
app.get("/", function(req, res) {
	res.sendFile("index.html");
});

app.get("/login", function(req, res) {
	res.sendFile(path.join(__dirname, "public", "login.html"));
});

var users = {
	test: "test123"
}

app.post("/login", function(req, res) {
	console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;
	if(username && password) {
		console.log(users[username]);
		if(users[username] && users[username] === password) {
			console.log("password matches");
			req.session.username = req.body.username;
			res.redirect("/memberonly");
		} else {
			res.redirect("/login");
		}
	}
});

app.get("/memberonly", function(req, res) {
	var username = req.session.username;
	if(!req.session || !username) {
		return res.redirect("/login");
	}
	res.end("Welcome to the member-only area "+username+"!!!");
});

app.get("/logout", function(req, res) {
	if(!req.session || !req.session.username) {
		return res.end("You're not even logged in! Click <a href=\"/login\">here</a> to login!");
	}
	req.session.destroy(function(err) {
		if(err) {
			console.log("error: "+err.message);
		}
	});
	res.redirect("/login");
});

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