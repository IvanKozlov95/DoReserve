var express  	= require('express');
var router   	= express.Router();
var passport 	= require('passport');
var mongoose 	= require('mongoose');
var Client 		= mongoose.model('Client');
var Reservation = mongoose.model('Reservation');
var log 		= require('../../util/log')(module);
var mw 	 	    = require('../../middleware/authMw');

router.get('/home', mw.mustClient, function(req, res, next) {
	Client.findById(req.user.id, function(err, client) {
		if (err) return next(err);

		client.getReservations(null, function(err, reservations) {
			if (err) return next(err);

			res.render('client/home', {
				client: client.toJSON(),
				reservations: reservations
			});
		});
	});
})

module.exports = router;