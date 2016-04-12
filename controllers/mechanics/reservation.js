var express     = require('express'),
	router 	    = express.Router(),
	reCaptcha   = require('../../middleware/reCaptcha'),
	checkFields = require('../../middleware/checkFields'),
	mongoose    = require('../../lib/mongoose'),
	ObjectId    = mongoose.Types.ObjectId;
	Reservation = mongoose.model('Reservation'),
	Plan 	    = mongoose.model('Plan'),
	Company 	= mongoose.model('Company'),
	log 	    = require('../../util/log')(module);

router.get('/:id', function(req, res, next) {
	// cast to id 
	try {
		var id = new ObjectId(req.params.id)
	} catch (e) { }

	Reservation.findById(id, function(err, reserve) {
		if (err) return next(err);

		if (reserve) {
			if (reserve.client == req.user.id) {
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

router.post('/create', reCaptcha, checkFields([
		'phone|email',
		'date',
		'time'
	]), function(req, res, next) {
	Company.findById(req.body.companyid, function(err, company) {
		if (err) return next(err);

		if (company) {

		}
	})
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