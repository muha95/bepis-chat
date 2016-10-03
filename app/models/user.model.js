var path = require("path");

var UserSchema = require(path.join("..", "schemas", "user.schema.js"));

module.exports = function(mongoose) {
    return mongoose.model("User", UserSchema);
};
