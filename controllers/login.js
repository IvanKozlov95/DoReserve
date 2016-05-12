var express  = require('express'),
 	router   = express.Router(),
 	passport = require('passport'),
 	mongoose = require('mongoose'),
 	User 	 = mongoose.model('User'),
 	log 	 = require('../util/log')(module);


router.get('/', function(req, res, next) {
	res.render('login');
});

router.post('/', function(req, res, next) {
  passport.authenticate('local',
    function(err, user, info) {
      if (err) return next(err);
      if (user) {
        req.logIn(user, function(err) {
          return err
            ? next(err)
            : res.redirect('/');
        });
      } else {
        res.render('login', { message: info.message });
      } 
    }
  )(req, res, next);
});

module.exports = router;