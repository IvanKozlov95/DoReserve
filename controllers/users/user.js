var express   = require('express'),
	router 	  = express.Router(),
	auth 	  = require('../../middleware/authMw'),
	mongoose  = require('../../lib/mongoose'),
	log 	  = require('../../util/log')(module),
	storages  = require('../../util/storages'),
 	multer	  = require('multer'),
 	upload	  = multer({ storage: storages.logoStorage });

router.get('/home', auth.mustAuthenticated, function(req, res, next) {
	res.redirect('/' + req.user.__t + '/home');
});

router.get('/profile', auth.mustAuthenticated, function(req, res, next) {
	var edit = !!req.query.edit;
	var User = mongoose.model('User');

	User
		.findById(req.user.id)
		// .lean()
		.exec((err, user) => {
			if (err) return next(err);
			log.info(user.toJSON());
			res.render('user/profile', {
				user: user,
				json: user.toJSON && user.toJSON(),
				edit: edit
			});
		})
});

router.post('/update', upload.single('logo'), auth.mustAuthenticated, function(req, res, next) {
	log.info('here');
	log.info(req.body.logo);
	if (req.user.id != req.body.id) {
		return res.status(403).end();
	}

	User.findById(req.body.id, (err, user) => {
		if (err) return next(err);

		if (user) {
			for (var i in req.body) {
				user[i] = req.body[i];
			}
			user.save((err) => {
				if (err) return next(err);

				log.info('User was updated');
				res.redirect('/user/profile');
			});
		} else {
			res.status(404).end();
		}
	});
})

module.exports = router;