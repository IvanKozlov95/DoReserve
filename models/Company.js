var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema,
    User     = mongoose.model('User');


var CompanySchema = new Schema({
  schemas: [],
  logo: String,
  address: String
});

User.discriminator('Company', CompanySchema);