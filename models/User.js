var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema,
    crypto   = require('crypto');

var UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  hashedPassword: { type: String, required: true },
  name: String,
  email: String,
  phone: String,
  salt: { type: String, required: true }
});

UserSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

UserSchema.virtual('password')
  .set(function(password) {
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  });

UserSchema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) == this.hashedPassword;
}

mongoose.model('User', UserSchema);