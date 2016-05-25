var mongoose 	 = require('../lib/mongoose'),
    Schema   	 = mongoose.Schema,
    User     	 = mongoose.model('User'),
    async 	 	 = require('async'),
    crypto     = require('crypto'),
    commonUtil = require('../util/common'),
    HtmlError  = require('../lib/HtmlError'),
    log        = require('../util/log')(module);

var ClientSchema = new Schema({
  reservations: [ Schema.Types.ObjectId ],
  favoriteCompanies: [],
  friends: [],
  logo: String
});

ClientSchema.methods.toJSON = function() {
  return {
    _id: this.id,
    username: this.username,
    name: this.name,
    email: this.email,
    phone: this.phone,
    _logo: this.logo,
    _reservationsLength: this.reservations.length
  }
}

ClientSchema.statics.createAnon = function(options, cb) {
  commonUtil
    .checkEmail(options.email)
      .then(
        result => {
          if (result) {
              new this({
                username: crypto.createHmac('sha1', Math.random() + '').update(Date.now.toString()).digest('hex'),
                password: Math.random() + '',
                name: 'Anonymous',
                email: options.email
              })
              .save(cb);
          } else {
            cb(new HtmlError(409, 'Email is already taken. Sorry.'));
          }
        },
        err => {
          return next(err);
        });
}

ClientSchema.methods.getReservations = function(options, cb) {
  var Reservation = mongoose.model('Reservation');

	async.map(this.reservations, function(item, callback) {
    Reservation
      .findById(item)
      .populate('company')
      .lean()
      .exec(callback); 
  }, cb);
}

ClientSchema.methods.addReservation = function(reserve, cb) {
  if (reserve) {
    this.reservations.push(reserve);
    this.save(cb);
  }
}

ClientSchema.methods.updateLogo = function(logo) {
  var fs     = require('fs');
  var config = require('config');

  if (logo) {
    try {
      fs.unlinkSync(config.get('dirs:root') + '\\public\\logos\\' + this.logo);
    } catch (e) {
      log.warn(e.message);
    }
  }

  this.logo = logo;
}

User.discriminator('Client', ClientSchema);