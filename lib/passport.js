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
    User.findOne({ username : username},function(err,user){
      return err 
        ? done(err)
        : user
          ? password === user.password
            ? done(null, user)
            : done(null, false, { message: 'Incorrect password.' })
          : done(null, false, { message: 'Incorrect username.' });
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null, user);
  });
});