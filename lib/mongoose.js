var mongoose = require('mongoose');
var config = require('../config');
var log = require('../util/log')(module);

mongoose.connect(config.get('mongoose:uri'), (err) => {
	if (err) return log.error(err);

	log.info("Connected to mongoose. Uri: " + config.get('mongoose:uri'));	
});

module.exports = mongoose;