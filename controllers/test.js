var express  = require('express'),
 	router   = express.Router(),
 	mongoose = require('mongoose');

router.get('/', function (req, res, next) {
	var Reservation = mongoose.model('Reservation');

	Reservation.findOne({}, (err, reservation) => {
		if (err) return next(err);

		reservation.getEmail((err, emails) => {
			res.send(emails);
		});
	});
});

module.exports = router;