/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    email: {
      type: 'string',
      unique: true
    },
    password: {
      type: 'string'
    },
    displayName: 'string',
    picture: 'string',
    
    // We don't wan't to send back encrypted password either
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  //encrypt
  beforeCreate: function(values, next) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(values.password, salt, function(err, hash) {
        values.password = hash;
        next();
      });
    });
  },
  //compare
  comparePassword: function(password, user, cb) {
    bcrypt.compare(password, user.password, function(err, isMatch) {
      // done(err, isMatch);
      if (err) cb(err);
      if (isMatch) {
        cb(null, true);
      } else {
        cb(err);
      }
    });
  }
};
