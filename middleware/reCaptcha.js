var request = require('request');

module.exports = function(req, res, next) {
	if (!req.body['g-recaptcha-response']) {
		return res.status(400).send('Please check the the captcha form.');
	}

	request.post({
		url: 'https://www.google.com/recaptcha/api/siteverify?secret=6LfxJx0TAAAAACdfiQBt166V59GM_1yxQNTWBlhv&response='+ req.body['g-recaptcha-response']
	}, function(err, httpResponse, body) {
		var success = JSON.parse(body).success;

		if (success) return next();

		return res.status(403).send('You shall not pass spamer!');
	});
}