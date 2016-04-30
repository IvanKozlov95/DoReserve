var express   	  = require('express'),
	router 	      = express.Router(),
	auth 	  	  = require('../../middleware/authMw'),
	mongoose  	  = require('../../lib/mongoose'),
	Client 	  	  = mongoose.model('Client'),
	Company  	  = mongoose.model('Company'),
	Reservation   = mongoose.model('Reservation'),
	log 	      = require('../../util/log')(module);

router.get('/', auth.mustCompany, (req, res, next) => {
	res.render('company');
});

router.get('/home', auth.mustCompany, function(req, res, next) {
	Company
		.findById(req.user.id, (err, company) => {
			if (err) return next(err);

			if (company) {
				company.getReservations(null, (err, reservations) => {
					if (err) return next(err);
					res.render('company/home', {
						company: company,
						reservations: reservations
					});
				})
			} else {
				log.warn('Couldn\'t a company but it should be here. Id: ' + res.user.id);
				res.status(404).end();
			}
		});
});

router.get('/all', function(req, res, next) {
	Company.find({}, function(err, companies) {
		if (err) return next(err);

		res.render('company/list', {
			companies: companies
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
	Company.findById(req.query.id, function(err, company) {
		if (err) return next(err);

		if (company) 
			res.status(200).json({ 
				company: company
			});
		else 
			res.status(404).end();
	})
});

router.get('/:id', function(req, res, next) {
	Company.findById(req.params.id, function(err, company) {
		if (err) return next(err);

		if (company) {
				log.info(company);
				company.getPlans(function(err, plans) {
					if (err) return next(err);
	
					res.render('company/profile', {
						company: company,
						plans: plans
					});
				})
			}
		else 
			res.status(404).end();
	})
});

module.exports = router;
