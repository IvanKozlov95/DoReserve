var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema,
    User     = mongoose.model('User'),
    Plan 	 = mongoose.model('Plan'),
    log 	 = require('../util/log')(module),
    async 	 = require('async');
 

var CompanySchema = new Schema({
  logo: String,
  address: String,
  desc: String,
  reservations: [ { type: Schema.Types.ObjectId, ref: 'Reservation' } ]
});

CompanySchema.methods.getPlans = function(cb) { 
	Plan.find({ company: this._id }, function(err, plans) {
		if (err) cb(err);

		cb(null, plans);
	})
}

CompanySchema.methods.addReservation = function(res, cb) {
  this.reservations.push(res);
  this.save(cb);
}

CompanySchema.methods.getReservations = function (filter, cb) {
  var Reservation = mongoose.model('Reservation');
  var result = [];
  
  async.map(this.reservations, function(item, callback) {
    Reservation
      .findById(item)
      .lean()
      .populate('client')
      .exec(callback)
  }, cb);
}

User.discriminator('Company', CompanySchema);