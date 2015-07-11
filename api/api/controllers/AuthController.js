/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = {
  login: function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.json(401, {
        err: 'email and password required'
      });
    }

    Users.findOne({
      email: email
    }, function(err, user) {
      if (!user) {
        return res.json(401, {
          err: 'invalid email or password'
        });
      }

      Users.comparePassword(password, user, function(err, valid) {
        if (err) {
          return res.json(403, {
            err: 'forbidden'
          });
        }

        if (!valid) {
          return res.json(401, {
            err: 'invalid email or password'
          });
        } else {
          res.send({
						user: user,
            token: createJWT(user)
          });
        }
      });
    });
  },
  //signup
  signup: function(req, res) {
    Users.findOne({
      email: req.body.email
    }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({
          message: 'Email is already taken'
        });
      }
      Users.create({
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password
      }).exec(function(err, user) {
        res.send({
					user: user,
          token: createJWT(user)
        });
      });
    });
  }
};

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}
