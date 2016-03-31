var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema,
    User     = mongoose.model('User');


var ClientSchema = new Schema({
  friendlyName: String,
  reservedTables: [],
  favoriteCompanies: [],
  friends: []
});

User.discriminator('Client', ClientSchema);