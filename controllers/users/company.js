var express   	  = require('express'),
	router 	      = express.Router(),
	auth 	  	  = require('../../middleware/authMw'),
	mongoose  	  = require('../../lib/mongoose'),
	Client 	  	  = mongoose.model('Client'),
	Company  	  = mongoose.model('Company'),
	Reservation   = mongoose.model('Reservation'),
	HtmlError	  = require('../../lib/HtmlError'),
	log 	      = require('../../util/log')(module);

router.get('/home', auth.mustCompany, function(req, res, next) {
	Company.findById(req.user.id, (err, company) => {
			if (err) return next(err);

			if (company) {
				company.getReservations(null, (err, reservations) => {
					if (err) return next(err);
					res.render('company/home', {
						company: company.toJSON()
					});
				})
			} else {
				log.warn('Couldn\'t a company but it should be here. Id: ' + res.user.id);
				res.status(404).end();
			}
		});
});

router.get('/reservations', auth.mustCompany, function(req, res, next) {
	var stList = Reservation.statusList();
	var status =  req.query.status != undefined 
		? [].indexOf.call(stList, req.query.status)
		: 0;

	Reservation
		.find({ company: req.user.id, status: status })
		.populate('client')
		.lean()
		.exec((err, reservations) => {
		if (err) return next(err);

		res.render('reservation/list', {
			company: req.user._id,
			reservations: reservations,
			stList: stList
		});
	});
});

router.get('/all', function(req, res, next) {
	var client = (req.user && req.user.__t == 'Client')
		? req.user
		: {};

	Company.find({}, function(err, companies) {
		if (err) return next(err);

		res.render('company/list', {
			companies: companies,
			client: client
		});
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
				next(new HtmlError(404));
		})
});

router.get('/profile', function(req, res, next) {
	var id = req.query.id;

	try {
		id = ObjectId(id);
	} catch (e) {
		return next(new HtmlError(404));
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
				next(new HtmlError);
			}
		});
});

router.get('/search', function(req, res, next) {
	var name = req.query.name;
	var regex = new RegExp(name, 'i');
	Company
		.find({ 'name': { $regex: regex } })
		.lean()
		.exec(function(err, companies) {
			if (err) return next(err);

			if (!!companies) {
				return res.json(companies);
			} else {
				return next(new HtmlError(404));
			}
		});
});

module.exports = router;
