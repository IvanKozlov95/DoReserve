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
		new mongoose.models.Client({username: 'Ivan', password: '123', name: 'Ivan Kozlov', email: 'ikozlov9000@gmail.com', phone: '7 (915) 812 56 69'}),
		new mongoose.models.Client({username: 'Vasya', email: 'Vasya@Vasya.Vasya', password: '123'}),
		new mongoose.models.Client({username: 'admin', password: '123'}),
		new mongoose.models.Company({username: 'company1', password: '123', name: 'Rocco', email: 'asd@asd.com', phone: '92-90-05', address: 'Pushkina sq., 2', desc: 'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.', logo: 'rocco.jpg'}),
		new mongoose.models.Company({username: 'company2', password: '123', name: 'Company', email: 'company@company.com', phone: '123-456-789', address: 'Schorsa st., 68', desc: 'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.'})
	];

	async.each(users, function(item, cb) {
		item.save(cb);
	}, cb);
}

function createReservations(cb) {
	var list = [
		{
			client: 'Ivan',
			company: 'company1'
		}, 
		{
			client: 'Vasya',
			company: 'company1'
		}
	];
	async.each(list, function(item, callback) {
		createSingleReservation(item.client, item.company, callback);
	}, cb)
}


function createSingleReservation(clientName, companyName, cb) {
	var User = mongoose.model('User');
	var Reservation = mongoose.model('Reservation');

	async.parallel([ (callback) => {
			User.find({username: clientName}, callback);
		}, (callback) => {
			User.find({username: companyName}, callback);
		} ], (err, results) => {
			if (err) return cb(err);

			clientId = results[0][0].id;
			companyId = results[1][0].id;
			Reservation.create({
				client: clientId,
				company: companyId,
				date: new Date(),
				time: '99:99',
			}, cb);
		});
}

async.series([
	open,
	dropDatabase,
	requireModels,
	createUsers,
	createReservations,
	], function(err) {
		if (!err) {
			log.info("Test db've been created");
		} else {
			log.error(err);
		}

		mongoose.disconnect();
	});