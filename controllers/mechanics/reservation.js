var express     = require('express'),
	router 	    = express.Router(),
	reCaptcha   = require('../../middleware/reCaptcha'),
	auth		= require('../../middleware/authMw'),
	mongoose    = require('../../lib/mongoose'),
	Reservation = mongoose.model('Reservation'),
	mailer		= require('../../util/mailer'),
	HtmlError	= require('../../lib/HtmlError'),
	log 	    = require('../../util/log')(module);

router.get('/', auth.mustAuthenticated, function(req, res, next) {
	var ObjectId = mongoose.Types.ObjectId;
	try {
		var id = new ObjectId(req.query.id)
	} catch (e) { 
		return next(new HtmlError(404));
	}

	Reservation
		.findById(id)
		.populate('client')
		.populate('company')
		.lean()
		.exec(function(err, reserve) {
			if (err) return next(err);
			if (reserve) {
				if (reserve.client._id == req.user.id
					|| reserve.company._id == req.user.id) {
					res.render('reservation/home', {
						reservation: reserve,
						status: Reservation.getStatusText(reserve.status)
					});
				} else {
					next(new HtmlError(403))
				}
			} else {
				return next(new HtmlError(404));
			}
		});
});

router.post('/create', auth.mustClientOrAnon, reCaptcha, function(req, res, next) {
	var client;
	var Company = mongoose.model('Company');
	var Client = mongoose.model('Client');
	var promise = new Promise((resolve, reject) => {
		if (req.user && req.user.email == req.body.email) {
			resolve(req.user.id);
		} else {
			Client.createAnon({
				email: req.body.email
			}, (err, user) => {
				if (err) reject(err);
				log.info('New user have been created. Id: ' + user.id);
				resolve(user.id);
			});
		}
	});
	
	promise
		.then(
			client => {
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

					return res.status(200).json('Reservation\'ve been created. Check your mail.');
				});
			},
			error => {
				return next(error);
			}
		);
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