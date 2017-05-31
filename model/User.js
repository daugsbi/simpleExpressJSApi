'strict';

const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const emailType = require('mongoose-type-email');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

/**
 * The user of the insurance application
 * @type Schema of User
 */
let UserSchema = new Schema({
  email: { type: mongoose.SchemaTypes.Email, required: true, index: { unique: true } },
  token: { type: String },
  password: { type: String, required: true }
});

/**
 * Add token with first insert
 */
UserSchema.pre('insert', function(next){
  let user = this;
  user.token = uuidV4();
  next();
});

/**
 * Hash password in pre saving hook
 * source: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
 */
UserSchema.pre('save', function(next){
  let user = this;
  // only before saving
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Export to use
const User = mongoose.model('User', UserSchema);

module.exports = User;