var express  	= require('express');
    router   	= express.Router(),
    mongoose 	= require('mongoose'),
    ObjectId	= mongoose.Types.ObjectId,
    log 		= require('../../util/log')(module),
    commonUtil	= require('../../util/common'),
    HtmlError   = require('../../lib/HtmlError'),
    mw 	 	    = require('../../middleware/authMw');

router.get('/home', mw.mustClient, function(req, res, next) {
	var Reservation = mongoose.model('Reservation');

	commonUtil.retrieveClientInfoById(req.user.id)
		.then(
			data => {
				if (data) {
					res.render('client/home', data);
				} else {
					return next(new HtmlError(404));
				}
			})
		.catch((err) => {
				return next(error);
			});
});

router.get('/profile', function(req, res, next) {
	var id = req.query.id;
	var Reservation = mongoose.model('Reservation');

	try {
		id = ObjectId(id);
	} catch (e) {
		return next(new HtmlError(404));
	}
	commonUtil.retrieveClientInfoById(id, false)
		.then(
			data => {
				if (data) {
					res.render('client/profile', data);
				} else {
					return next(new HtmlError(404));
				}
			},
			error => {
				return next(error);
			});
});

module.exports = router;