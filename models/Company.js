var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema,
    User     = mongoose.model('User'),
    Plan 	 = mongoose.model('Plan'),
    log 	 = require('../util/log')(module),
    async 	 = require('async');
 

var CompanySchema = new Schema({
  logo: String,
  address: String,
  desc: String
});

CompanySchema.methods.getPlans = function(cb) { 
	Plan.find({ company: this._id }, function(err, plans) {
		if (err) cb(err);

		cb(null, plans);
	})
}

User.discriminator('Company', CompanySchema);