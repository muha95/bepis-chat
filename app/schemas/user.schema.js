var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // used to salt a string 2^n times.

var Schema = mongoose.Schema;

module.exports = UserSchema;

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: 
    { 
        type: String, 
        required: true, 
        validate: 
        {
            validator: function(v) { return /^$/.test(v); }, 
            message: "Password must contain at 6 characters, "+
                    "include at least one upper-case and numerical character"
        }
    },
    email: { type: String, required: true, index: { unique: true } },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    admin: { type: Boolean, default: false },
    joined: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

UserSchema.methods.comparePassword = function(inputToTest, callback) {
    var user = this;
    bcrypt.compare(inputToTest, user.password, function(err, result) {
        if(err) {
            console.log("error: "+err.message);
            callback(err);
        } else {
            callback(null, result);
        }
    });
};

UserSchema.pre("save", function(next) {
    var user = this;
    if(!user.isModified("password")) {
        return next();
    }

    bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
        if(err) {
            console.log("error: "+err.message);
            next(err);
        } else {
            user.password = hash;
            next();
        }
    });
});