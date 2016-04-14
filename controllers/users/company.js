var express   = require('express'),
	router 	  = express.Router(),
	mw 	 	  = require('../../middleware/authMw'),
	mongoose  = require('../../lib/mongoose'),
	Plan 	  = mongoose.model('Plan'),
	Company   = mongoose.model('Company'),
	log 	  = require('../../util/log')(module);

router.get('/', mw.mustCompany, (req, res, next) => {
	res.render('company');
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

		if (company) 
			company.getPlans(function(err, plans) {
				if (err) return next(err);

				res.render('company/index', {
					company: company,
					plans: plans
				});
			})
		else 
			res.status(404).end();
	})
});

module.exports = router;
