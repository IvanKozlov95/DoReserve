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

router.post('/asdasd',  reCaptcha, function(req, res, next) {
	var planId = req.body.plan,
		tableId = req.body.table,
		date = req.body.date,
		time = {
			from: req.body['start-time'],
			to: req.body['end-time']
		},
		client = req.user && req.user.id,
		persons = req.body.persons;


	Plan.findById(planId, function(err, plan) {
		if (err) return next(err);

		log.info(req.body);

		if (plan) {
			plan.findTable(tableId, function(err, table) {
				if (err) return next(err);

				if (table) {
					Reservation.create({
						plan: planId,
						table: tableId,
						date: date,
						time: time,
						client: client,
						persons: persons
					}, function(err, reserve) {
						if (err) return next(err);

						req.user.addReservation(reserve.id, function(err) {
							if (err) return next(err);
						});

						res.redirect('/user/home');
					});
				}
			});
		}
	});
});

module.exports = router;