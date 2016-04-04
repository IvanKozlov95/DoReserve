var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema,
    User     = mongoose.model('User'),
    Plan 	 = mongoose.model('Plan'),
    log 	 = require('../util/log')(module),
    async 	 = require('async');
 

var CompanySchema = new Schema({
  plans: [ Schema.Types.ObjectId ],
  logo: String,
  address: String
});

CompanySchema.methods.createPlan = function(plan, cb) {
	this.plans = this.plans && [];

	plan = new Plan({
		tables: plan.tables
	});
	plan.save(cb);

	this.plans.push(plan.id);
	this.save(function(err) {
		if (err) cb(err);
	});
}

CompanySchema.methods.getPlans = function(cb) { 
	async.map(this.plans, function(planId, callback) {
		Plan.findById(planId, function(err, plan) {
			if (err) callback(err);

			if (plan) {
				callback(null, plan);
			} else {
				log.warn("Couldn't find plan with id: " + planId);
			}
		})
	}, cb);
}

User.discriminator('Company', CompanySchema);