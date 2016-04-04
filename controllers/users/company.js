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

			log.info('Plans: ' + plans);
			res.render('planList', {
				plans: plans
			});
		})
	});
});

router.get('/plan/:id', function(req, res, next) {
	log.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	Plan.findById(req.params.id).lean().exec(function(err, plan) {
		if (err) return next(err);

		if (plan) {
			res.render('plan', {
				plan: plan
			});
		} else {
			res.status(404).end();
		}
	});
});

router.get('/plan', function(req, res, next) {
	res.render('plan');
});

router.post('/plan', function(req, res, next) {
	var data = req.body;

	if (data.id) {
		Plan.findById(data.id, function(err, plan) {
			if (err) return next(err);

			if (plan) {
				plan.tables = data.tables;
				plan.save(function(err) {	
					if (err) throw err;

					log.info("Plan've been updated");
				});
			} else {
				log.info('Plan not found');
			}
		});
	} else {
		Company.findById(req.user.id, function(err, company) {
			if (err) return next(err);

			company.createPlan(data, function(err) {
				if (err) return next(err);

				log.info('Created a new plan');
			});
		})
	}

	res.status(200).send("OK");
})

module.exports = router;
