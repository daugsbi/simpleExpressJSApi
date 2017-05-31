var passport = require('passport');

// Bearer authentication strategy
var Strategy = require('passport-http-bearer').Strategy;
const User = require('../model/User');

// Configure passport to find corresponding user with token
passport.use(new Strategy(
  function(token, cb) {
    User.findOne({token: token}, function(err, user){
      if (err) return cb(err);
      if (!user) return cb(null, false);
      return cb(null, user);
    })
  }));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

let customPassport = passport;
module.exports = customPassport;