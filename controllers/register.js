var router   = require('express').Router(),
 	passport = require('passport'),
 	mongoose = require('mongoose'),
 	Client	 = mongoose.model('Client'),
 	Company  = mongoose.model('Company'),
 	log 	 = require('../util/log')(module),
 	mw 		 = require('../middleware/authMw');

router.get('/', mw.mustAnon, function(req, res, next) {
	res.render('register');
});

router.post('/', function(req, res, next) {
	var user = req.body._t == 'company'
		? new Company( { 
			username: req.body.username,
			password: req.body.password,
			address: req.body.address
		} )
		: new Client( {
			username: req.body.username,
			password: req.body.password,
			friendlyName: req.body.friendlyName,
			phone: req.body.phone,
			email: req.body.email
		} );

	user.save(function(err) {
		if (err instanceof mongoose.Error.ValidationError){
			log.warn(err.toString());
			res.status(400).end();
		}

		// If err.code == 11000 this is duplicate key error
		// that means that user already exists
		if (err && 	err.code == 11000) {
			return res.status(400).end();
		}

		return err 
		?  next(err)
		  : req.logIn(user, function(err) {
		    return err
		      ? next(err)
		      : res.status(200).end();
		  });
		});
});

module.exports = router;