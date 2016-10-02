var router = require("express").Router();
var path = require("path");

module.exports = router;

router.get("/login", function(req, res) {
	res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

var users = {
	test: "test123"
}

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