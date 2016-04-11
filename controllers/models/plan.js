var express   = require('express'),
	router 	  = express.Router(),
	mw 	 	  = require('../../middleware/authMw'),
	mongoose  = require('../../lib/mongoose'),
	Plan 	  = mongoose.model('Plan'),
	Company   = mongoose.model('Company'),
	log 	  = require('../../util/log')(module);

router.get('/', function(req, res, next) {
	var id = req.query.id;

	Plan.findById(id, function(err, plan) {
		if (err) return next(err);

		if (plan) {
			res.render('plan/index', {
				company: req.user.id,
				plan: plan
			});
		} else {
			res.status(404).end();
		}
	});
});

router.get('/create', mw.mustCompany, function(req, res, next) {
	res.render('plan/create', {
		company: req.user.id
	});
});

router.post('/', mw.mustCompany, function(req, res, next) {
	var postData = req.body.plan;

	if (postData.id) {
		Plan.findById(postData.id, function(err, plan) {
			if (err) return next(err);

			if (plan) {
				plan.update(postData, function(err) {
					if (err) return next(err);

					log.warn('Plan\'ve been updated');
				});
			} else {
				log.warn('Plan not found with id: ' + postData.id);
			}
		});
	} else {
		postData.company = req.user.id;
		Plan.create(postData, function(err) {
			if (err) return next(err);

			log.warn('Plan\'ve been created');
		});
	}

	res.status(200).end('OK');
})

module.exports = router;