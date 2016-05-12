var express     = require('express'),
	router 	    = express.Router(),
	reCaptcha   = require('../../middleware/reCaptcha'),
	auth		= require('../../middleware/authMw'),
	mongoose    = require('../../lib/mongoose'),
	Reservation = mongoose.model('Reservation'),
	mailer		= require('../../util/mailer');
	log 	    = require('../../util/log')(module);

router.get('/:id', function(req, res, next) {
	var ObjectId = mongoose.Types.ObjectId;
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

router.post('/create', auth.mustClientOrAnon, reCaptcha, function(req, res, next) {
	var client;
	var Company = mongoose.model('Company');

	if (res.user) {
		client = req.user.id;
	} else {
		var Client = mongoose.model('Client');

		Client.createAnon({
			email: req.body.email
		}, (err, user) => {
			if (err) return next(err);
			log.info('New user have been created. Id: ' + user.id);
			client = user.id;
		});
	}

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
	if (req.user.id != req.body.company)  return res.status(403).end();

	Reservation
		.findById(req.body.reservation)
		.exec( (err, reservation) => {
			if (err) return next(err);
			
			if (reservation) {
				reservation.refresh(req.body, (err) => {
					if (err) return next(err);
					log.info('Reservation\'ve been updated');
					res.status(200).end();
				});
			} else {
				log.warn('Reservation is missing. Hmm...');
				res.status(404).end();
			}
		});
})

module.exports = router;