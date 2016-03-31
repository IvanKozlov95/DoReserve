var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User 	 = mongoose.model('User');
var log 	 = require('../../util/log')(module);

router.get('/login', function(req, res, next) {
	res.render('login');
})

router.post('/login', function(req, res, next) {
	passport.authenticate('local',
    function(err, user, info) {
      return err 
        ? next(err)
        : user
          ? req.logIn(user, function(err) {
              return err
                ? next(err)
                : res.redirect('/user/profile');
            })
          : res.redirect('/login');
    }
  )(req, res, next);
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.post('/register', function(req, res, next) {
	var user = new User({ username: req.body.username, password: req.body.password});
	user.save(function(err) {
		// If err.code == 11000 this is duplicate key error
		// that means that user already exists
		if (err && 	err.code == 11000) {
			return res.render('register', {
			  	message: 'Current user ' + req.body.username + ' already exist'
		  	});
		}

		return err 
		?  next(err)
		  : req.logIn(user, function(err) {
		    return err
		      ? next(err)
		      : res.redirect('/private'); // CHANGE IT YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
		  });
		});
});

module.exports = router;