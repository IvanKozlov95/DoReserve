var mongoose 	= require('../lib/mongoose'),
    Schema   	= mongoose.Schema,
    User     	= mongoose.model('User'),
    async 	 	= require('async'),
    crypto   = require('crypto');

var ClientSchema = new Schema({
  reservations: [ Schema.Types.ObjectId ],
  favoriteCompanies: [],
  friends: []
});

ClientSchema.statics.createAnon = function(options, cb) {
  var client = new this({
    username: crypto.createHmac('sha1', Math.random() + '').update(Date.now).digest('hex'),
    password: Math.random() + '',
    name: 'Anonymous',
    email: options.email
  });

  client.save(cb);
}

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