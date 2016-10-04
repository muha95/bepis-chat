var router = require("express").Router();
var path = require("path");

var staticFilesPath = path.join(__dirname, "..", "..", "public");

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
	var query = UserModel.findOne({username: req.body.username});
	query.exec(function(err, user) {
		var userFromDB = user;
		if(err) {
			console.log(err);
			res.redirect("/login");
		} else if(userFromDB) {
			// Continue with password check
			userFromDB.comparePassword(req.body.password, function(err, result) {
				if(err) {
					console.log(err);
					res.redirect("/login");
				}
				if(result) {
					 req.session.user = userFromDB;
					 res.redirect("/memberonly");
				} else {
					 res.redirect("/login");
				}
			});
		} else {
			// User not found
			res.redirect("/login");
		}
	});
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
	if(!req.session || !req.session.user) {
		return res.redirect("/login");
	} else {
		//res.send(`Welcome to the member-only area ${req.session.user.username}!!!`);
		if(req.session.user) {
			res.end("Welcome to the member-only area "+req.session.user.username+"!!! \n"
							+JSON.stringify(req.session.user));
		} else {
			res.end("Unable to print user object!");
		}
	}
});

router.get("/logout", function(req, res) {
	req.session.destroy(function(err) {
		if(err) {
			console.log("error: "+err.message);
		}
	});
	res.redirect("/login");
});
