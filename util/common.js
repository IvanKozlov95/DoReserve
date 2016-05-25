var mongoose = require('../lib/mongoose');

/**
 * Checks if emails exists in database
 * @email - email to check
 * @returns Promise that returns true if email do not exists and false if do.
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

/**
 * Retrieve client information
 * @id - client's id
 * @returns Promise that returns client information.
 */
 function retrieveClientInfoById(id, withReservation) {
	var Client = mongoose.model('Client');

	return new Promise((resolve, reject) => {
		Client
			.findById(id)
			.exec(function(err, client) {
				if (err) reject(err);

				if (client) {
					if (withReservation) {
						client.getReservations(null, function(err, reservations) {
							if (err) reject(err);
							
							resolve({
								client: client.toJSON(),
								reservations: reservations
							});
						});
					} else {
						resolve({
							client: client.toJSON()
						});
					}
				} else {
					resolve(null);
				}
			});
	});
}



module.exports = {
	checkEmail: checkEmailUnique,
	retrieveClientInfoById: retrieveClientInfoById
}