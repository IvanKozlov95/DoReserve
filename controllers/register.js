var express  = require('express'),
 	router   = express.Router(),
 	passport = require('passport'),
 	mongoose = require('mongoose'),
 	User 	 = mongoose.model('User'),
 	Client	 = mongoose.model('Client'),
 	Company  = mongoose.model('Company'),
 	log 	 = require('../util/log')(module);

router.get('/', function(req, res, next) {
	res.render('register');
});

router.post('/', function(req, res, next) {
	var user = req.body.company
		? new Company( { 
			username: req.body.username,
			password: req.body.password,
			address: req.body.address
		} )
		: new Client( {
			username: req.body.username,
			password: req.body.password,
			friendlyName: req.body.friendlyName
		} );

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
		      : res.redirect('/');
		  });
		});
});

module.exports = router;