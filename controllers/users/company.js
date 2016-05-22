var express   	  = require('express'),
	router 	      = express.Router(),
	auth 	  	  = require('../../middleware/authMw'),
	mongoose  	  = require('../../lib/mongoose'),
	Client 	  	  = mongoose.model('Client'),
	Company  	  = mongoose.model('Company'),
	Reservation   = mongoose.model('Reservation'),
	log 	      = require('../../util/log')(module);

router.get('/home', auth.mustCompany, function(req, res, next) {
	var edit = req.query.edit;
	Company.findById(req.user.id, (err, company) => {
			if (err) return next(err);

			if (company) {
				company.getReservations(null, (err, reservations) => {
					if (err) return next(err);
					res.render('company/home', {
						company: company,
						reservations: reservations,
						stList: Reservation.statusList(),
						edit: edit
					});
				})
			} else {
				log.warn('Couldn\'t a company but it should be here. Id: ' + res.user.id);
				res.status(404).end();
			}
		});
});

router.get('/reservations', auth.mustCompany, function(req, res, next) {
	Reservation
		.find({ company: req.user.id })
		.populate('client')
		.exec((err, reservations) => {
		if (err) return next(err);

		res.render('reservation/list', {
			company: req.user._id,
			reservations: reservations,
			stList: Reservation.statusList()
		});
	});
});

router.get('/all', function(req, res, next) {
	var user = (req.user && req.user.__t == 'Client')
		? req.user
		: {};

	Company.find({}, function(err, companies) {
		if (err) return next(err);

		res.render('company/list', {
			companies: companies,
			user: user
		});
	});
});

router.get('/plans', function(req, res, next) {
	Company.findById(req.user.id, function(err, company) {
		if (err) return next(err);

		company.getPlans(function(err, plans) {
			if (err) return next(err);

			log.info(plans.toString());
			res.render('plan/list', {
				plans: plans
			});
		})
	});
});

router.get('/info', function(req, res, next) {
	Company
		.findById(req.query.id)
		.lean()
		.exec(function(err, company) {
			if (err) return next(err);
			if (company) 
				res.status(200).json(company);
			else 
				res.status(404).end();
		})
});

router.get('/profile', function(req, res, next) {
	var id = req.query.id;

	try {
		id = ObjectId(id);
	} catch (e) {
		return res.status(404).end();
	}

	Company
		.findById(id)
		.exec(function(err, company) {
			if (err) return next(err);

			if (company) {
				res.render('company/profile', {
					company: company.toJSON()
				});
			}
			else {
				res.status(404).end();
			}
		});
});

module.exports = router;
