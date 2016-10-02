var mongoose = require("mongoose");

var UserSchema = require(path.join("..", "schemas", "user.schema.js"));
var UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;