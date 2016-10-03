var router = require("express").Router();
var path = require("path");

var staticFilesPath = path.join(__dirname, "..", "public");

var UserModel;

module.exports = function(mongoose) {
	UserModel = require(path.join(__dirname, "..", "models", "user.model.js"))(mongoose);
	return router;
}; 

router.get("/login", function(req, res) {
	res.sendFile(path.join(staticFilesPath, "login.html"));
});

var users = {
	test: "test123"
};

router.post("/login", function(req, res) {
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

router.post("/register", function(req, res) {
	var user = new UserModel({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
    	firstName: req.body.firstName,
    	lastName: req.body.lastName
	});
});

router.get("/memberonly", function(req, res) {
	var username = req.session.username;
	if(!req.session || !username) {
		return res.redirect("/login");
	}
    res.end("Welcome to the member-only area "+username+"!!!");
	
});

router.get("/logout", function(req, res) {
	req.session.destroy(function(err) {
		if(err) {
			console.log("error: "+err.message);
		}
	});
	res.redirect("/login");
});