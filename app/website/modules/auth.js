var jwt = require('jsonwebtoken');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;

var Auth = function(config) {
    this.config = config.parameters || {};
    var self = this;
    passport.use(new Strategy(
        function(token, cb) {
            new Auth(config).verifyUser(token, function(exists) {
                if (!exists) return cb(null, false);
                jwt.verify(token, self.config.secret, function(err, decoded) {
                    if (err) return cb(err)
                    decoded.token = token
                    return cb(null, decoded);
                })
            });
        }));
}

Auth.users = [];

Auth.prototype.saveUser = function(user, cb) {
    var self = this;
    jwt.sign(user, self.config.secret, {}, function(err, token) {
        if (err) return cb(err);
        user.token = token;
        Auth.users.push(user);
        return cb(null, token)
    });
}

Auth.prototype.removeUser = function(user,cb) {
    var self = this;
    Auth.users.forEach(function(u,n){
        if(u.token === user.token){
          Auth.users.splice(n,1)
          return cb(null,true)
        }
        cb(true)
    })
}

Auth.prototype.getUser = function(req, res, next, cb) {
    passport.authenticate('bearer', function(err, user, info) {
        if (err) {
            console.log("Hubo un error: ", err)
            return cb(true)
        }
        if (!user) {
            return cb(true)
        }
        cb(null , user)
    })(req, res, next);
}

Auth.prototype.verifyUser = function(token, cb) {
    cb(Auth.users.find(function(user) {
        return user.token === token;
    }))
}


module.exports = Auth;
