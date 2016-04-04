var mongoose = require('lib/mongoose'),
 	log      = require('util/log')(module),
	async 	 = require('async');

function open(cb){
    mongoose.connection.on('open', cb);
}

function dropDatabase(cb) {
	var db = mongoose.connection.db;
	db.dropDatabase(cb);
}

function requireModels(cb) {
	require('models');

	async.each(Object.keys[mongoose.models], function(modelName, cb) {
		mongoose.models[modelName].ensureIndexes(cb);
	}, cb);
}

function createUsers(cb) {
	var users = [
		new mongoose.models.Client({username: 'Ivan', password: '123'}),
		new mongoose.models.Client({username: 'Vasya', password: '123'}),
		new mongoose.models.Client({username: 'admin', password: '123'}),
		new mongoose.models.Company({username: 'company1', password: '123'}),
		new mongoose.models.Company({username: 'company2', password: '123'})
	];

	async.each(users, function(item, cb) {
		item.save(cb);
	}, cb);
}

async.series([
	open,
	dropDatabase,
	requireModels,
	createUsers
	], function(err, res) {
		if (!err) {
			log.info("Test db've been created");
		} else {
			log.error(err);
		}

		mongoose.disconnect();
	});