var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // used to salt a string 2^n times.

var Schema = mongoose.Schema;

module.exports = UserSchema;

var UserSchema = new Schema({
    username:
    {
        type: String,
        lowercase: true,
        required: true,
        index: { unique: true }
        validate:
        {
            validator: function(input) {
              return /^[a-zA-Z0-9]{4,}$/.test(input);
            },
            message: "Username must include at least 4 alphanumeric characters"
        }
    },
    password:
    {
        type: String,
        required: true,
        validate:
        {
            validator: function(input) {
              // How this regex works...
              // E.g., (?=.*?[A-Z]) this enforces an uppercase letter to be in the string
              // --- ?= enforces a match but exclusion from capture (positive lookahead)
              // --- .*? this allows the uppercase letters to be anywhere in the string
              //     without it then it expects an uppercase letter first. Technically,
              //     it goes through the entire string ("eats it up") and then backtracks through the
              //     string until it finds a match.
              // --- This is then repeated for all other required characters by using
              //     subsequent lookaheads following the same pattern.
              // --- On each new lookahead the cursor is reset to the beginning of the string.
              return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[A-Za-z0-9]{8,}$/.test(input);
            },
            message: "Password must contain at 8 characters, "+
                     "include at least one lowercase, uppercase and numerical character"
        }
    },
    email:
    {
        type: String,
        lowercase: true,
        required: true,
        index: { unique: true },
        validate:
        {
            validator: function(input) {
              // http://emailregex.com/ - slightly modified the recommended regex
              return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(input)
            },
            message: "Email is invalid"
        }
    },
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
    // Only hash the password if it's been changed.
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
