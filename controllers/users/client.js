var express  	= require('express');
    router   	= express.Router(),
    mongoose 	= require('mongoose'),
    ObjectId	= mongoose.Types.ObjectId,
    log 		= require('../../util/log')(module),
    HtmlError   = require('../../lib/HtmlError'),
    mw 	 	    = require('../../middleware/authMw');

router.get('/home', mw.mustClient, function(req, res, next) {
	getClientInfo(req.user.id)
		.then(
			data => {
				if (data) {
					res.render('client/home', data);
				} else {
					res.status(404).end();
				}
			},
			error => {
				return next(error);
			});
});

router.get('/profile', mw.mustClient, function(req, res, next) {
	var id = req.query.id;
	var Reservation = mongoose.model('Reservation');

	try {
		id = ObjectId(id);
	} catch (e) {
		return next(new HtmlError(404));
	}
	getClientInfo(id)
		.then(
			data => {
				if (data) {
					data.statusList = Reservation.statusList();
					res.render('client/profile', data);
				} else {
					return next(new HtmlError(404));
				}
			},
			error => {
				return next(error);
			});
});

function getClientInfo(id) {
    var Client = mongoose.model('Client');
	return new Promise((resolve, reject) => {
		Client.findById(id, function(err, client) {
			if (err) reject(err);

			if (client) {
				client.getReservations({deep: true}, function(err, reservations) {
					if (err) reject(err);

					resolve({
						client: client.toJSON(),
						reservations: reservations
					});
				});
			} else {
				resolve(null);
			}
		});
	});
}

module.exports = router;