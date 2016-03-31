var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var mongoose       = require('./mongoose');
var Company        = mongoose.model('Company');
var log            = require('../util/log')(module);

module.exports = passport.use(new LocalStrategy({
    companynameField: 'companyname',
    passwordField: 'password'
  }, function(companyname, password, done){
    log.info("Authentification request. Name: " + companyname + ', pass: ' + password);
    Company.findOne({ companyname : companyname}, function(err, company){
      return err 
        ? done(err)
        : company
          ? company.encryptPassword(password) === company.hashedPassword
            ? done(null, company)
            : done(null, false, { message: 'Incorrect password.' })
          : done(null, false, { message: 'Incorrect companyname.' });
    });
}));

passport.serializeCompany(function(company, done) {
  done(null, company.id);
});

passport.deserializeCompany(function(id, done) {
  Company.findById(id, function(err, company){
    err 
      ? done(err)
      : done(null, company);
  });
});