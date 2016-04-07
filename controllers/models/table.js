var express   = require('express'),
	router 	  = express.Router(),
	mw 	 	  = require('../../middleware/authMw'),
	mongoose  = require('../../lib/mongoose'),
	Plan 	  = mongoose.model('Plan'),
	Company   = mongoose.model('Company'),
	log 	  = require('../../util/log')(module);

router.get('/', function(req, res, next) {
	var planId = req.query.p;
	var tableId = req.query.t;

	if (planId && tableId) {
		Plan.findById(req.query.p).populate('company').exec(function(err, plan) {
			if (err) return next(err);

			if (plan) {
				table = plan.tables.id(tableId);
				log.info(JSON.stringify(plan.company));
				return table
					? res.render('tableInfo', {
						table: table,
						plan: plan,
						company: plan.company
					})
					: res.status(404).end();
			} else {
				res.status(404).end();
			}
		});
	}
});

module.exports = router;