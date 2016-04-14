var request = require('request');

module.exports = function(req, res, next) {
	request.post({
		url: 'https://www.google.com/recaptcha/api/siteverify?secret=6LfxJx0TAAAAACdfiQBt166V59GM_1yxQNTWBlhv&response='+ req.body['g-recaptcha-response']
	}, function(err, httpResponse, body) {
		var success = JSON.parse(body).success;
		if (success) return next();

		return res.status(403).send('Please reenter the captcha');
	});
}