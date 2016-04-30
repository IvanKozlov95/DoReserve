var express     = require('express'),
	router 	    = express.Router(),
	reCaptcha   = require('../../middleware/reCaptcha'),
	checkFields = require('../../middleware/checkFields'),
	auth		= require('../../middleware/authMw'),
	mongoose    = require('../../lib/mongoose'),
	ObjectId    = mongoose.Types.ObjectId;
	Reservation = mongoose.model('Reservation'),
	Plan 	    = mongoose.model('Plan'),
	Company 	= mongoose.model('Company'),
	Client 		= mongoose.model('Client'),
	log 	    = require('../../util/log')(module);

router.get('/:id', function(req, res, next) {
	// cast to id 
	try {
		var id = new ObjectId(req.params.id)
	} catch (e) { }

	Reservation.findById(id, function(err, reserve) {
		if (err) return next(err);

		if (reserve) {
			if (reserve.client == req.user.id
				|| reserve.company == req.user.id) {
				res.render('reservation', {
					reservation: reserve
				});
			} else {
				res.status(403).end();
			}
		} else {
			res.status(404).end();
		}
	})
});

router.post('/create', auth.mustClient, reCaptcha, function(req, res, next) {
	var client = req.user.__t == 'Client' 
		? req.user.id
		: null;

	Reservation.create({
		date: req.body.date,
		time: req.body.time,
		persons: req.body.persons,
		client: client,
		company: req.body.company,
		message: req.body.message
	}, (err, reservation) => {
		if (err) return next(err);

		log.info('Reservation\'ve been created. Id: ' + reservation.id);

		return res.status(200).send('OK');
	});
});

router.post('/update', auth.mustCompany, function(req, res, next) {
	Reservation.findById(req.body.reservation, (err, reservation) => {
		if (err) return next(err);

		if (reservation) {
			reservation.refresh(req.body, (err, r) => {
				if (err) return next(err);

				log.info('Reservation\'ve been updated. Id: ' + r.id);
			});
		}
	})
})

module.exports = router;