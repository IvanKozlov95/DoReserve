var mongoose = require('../lib/mongoose');

/**
 * Checks if emails exists in database
 * @email - email to check
 * @returns True if email do not exists and false if do.
 */
function checkEmailUnique(email) {
	var User = mongoose.model('User');

	return new Promise((resolve, reject) => {
		User.findOne({email: email}, (err, user) => {
			if (err) reject(err);
			resolve(user ? false : true);
		});
	});
}

module.exports.checkEmail = checkEmailUnique;