var mongoose 	= require('../lib/mongoose'),
    Schema   	= mongoose.Schema,
    User     	= mongoose.model('User'),
    async 	 	= require('async');

var ClientSchema = new Schema({
  reservations: [ Schema.Types.ObjectId ],
  favoriteCompanies: [],
  friends: []
});

ClientSchema.methods.getReservations = function(filter, cb) {
	//todo: add filter
	log.info(this.reservations);
	async.map(this.reservations, function(item, callback) {
    Reservation.findById(item, callback);
  }, cb);
}

ClientSchema.methods.addReservation = function(reserve, cb) {
  if (reserve) {
    this.reservations.push(reserve);
    this.save(cb);
  }
}

User.discriminator('Client', ClientSchema);