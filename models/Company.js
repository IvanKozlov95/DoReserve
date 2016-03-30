var mongoose = require('../lib/mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	async = require('async'),
	AuthError = require('../lib/AuthError');

module.exports = function(logger) {
	var Company = new Schema({
		name: {
			type: String,
			unique: true,
			required: true
		},
		hashedPasswod: {
			type: String,
			required: true
		},
		salt: {
			type: String,
			required: true
		},
		created: {
			type: Date,
			default: Date.now
		}
	});

	Company.methods.encryptPassword = function(password) {
		return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	};

	Company.virtual('password')
		.set(function(password) {
			this._plainPassword = password;
			this.salt = Math.random() + '';
			this.hashedPasswod = this.encryptPassword(password);
		})
		.get(function() {
			return this._plainPassword;
		});

	Company.methods.checkPassword = function(password) {
		return this.encryptPassword(password) == this.hashedPasswod;
	}

	Company.statics.authorize = function(username, password, cb) {
		var Company = this;

		async.waterfall([
			function(cb) {
				Company.findOne({name: username}, cb);
			},
			function(user, cb) {
				if (user && user.checkPassword(password)) {
					cb(null, user);
				} else {
					return cb(new AuthError("Cannot find user: " + username));
				}
			}], cb);
	};

	exports.Company = mongoose.model('Company', Company);
	logger.info('Load Company model to mongoose');
}