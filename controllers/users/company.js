var express   = require('express'),
	router 	  = express.Router(),
	mw 	 	  = require('../../middleware/authMw'),
	mongoose  = require('../../lib/mongoose'),
	Plan 	  = mongoose.model('Plan'),
	Company   = mongoose.model('Company'),
	log 	  = require('../../util/log')(module);

// ************
// Home routes
// ************
router.get('/', mw.mustCompany, (req, res, next) => {
	res.render('company');
});

// ************
// Plans routes
// ************
router.get('/plans', function(req, res, next) {
	Company.findById(req.user.id, function(err, company) {
		if (err) return next(err);

		company.getPlans(function(err, plans) {
			if (err) return next(err);

			log.info(plans.toString());
			res.render('planList', {
				plans: plans
			});
		})
	});
});

module.exports = router;
