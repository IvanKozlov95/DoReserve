var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var mongoose       = require('./mongoose');
var User           = mongoose.model('User');
var log            = require('../util/log')(module);

module.exports = passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, function(username, password, done){
    log.info("Authentification request. Name: " + username + ', pass: ' + password);
    User.findOne({ username : username},function(err, user){
      if (err) return done(err);

      if (user && user.checkPassword(password)) {
        done(null, user);
      } else {
        log.warn('Authentification request failed.');
        done(null, false, { message: 'Cannot find user like that.'})
      };
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log(done);
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null, user);
  });
});