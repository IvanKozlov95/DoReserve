var mongoose = require('../lib/mongoose'),
    log 	 = require('../util/log')(module),
    Schema   = mongoose.Schema,
    async 	 = require('async');

var ReservationSchema = new Schema({
	client: { type: Schema.Types.ObjectId, required: true, ref: 'Client' },
	company: { type: Schema.Types.ObjectId, required: true },
	date: { type: Date, required: true },
	message: String,
	time: { type: String, required: true },
	persons: Number,
	order: Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	status: { type: String, default: 'New'}
});

ReservationSchema.statics.create = function(options, cb) {
	var Client = mongoose.model('Client');
	var Company = mongoose.model('Company');
	var res = new this({
						// plan: options.planId,
						// table: options.tableId,
						client: options.client,
						company: options.company,
						date: options.date,
						time: options.time,
						persons: options.persons,
						message: options.message
					});

	res.save((err, reservation) => {
		if (err) cb(err);

		async.parallel([(callback) => {
			if (options.client) {
				Client.findById(options.client, (err, client) => {
						if (err) return callback(err);
						if (!client) {
							log.warn('There is no such client ' + options.client);
							return callback("Client not found");
						}

						client.addReservation(reservation.id, callback);
					})
			};
		}, (callback) => {
			Company.findById(options.company, function (err, company) {
				if (err) return callback(err);
				if (!company) {
					log.warn('There is no such company ' + options.company);
					return callback("There is no such company");
				}

				company.addReservation(reservation.id, callback);
			});
		}], (err) => {
			if (err) return cb(err);

			cb(null, reservation);
		});
	});
}

ReservationSchema.methods.refresh = function(options, cb) {
	if (this.company != options.company) return cb("Access denied!");

	this.date = options.date;
	this.status = options.status;
	this.persons = options.persons;
	this.time = options.time;

	this.save(cb);
}

//todo:
//	implement order

mongoose.model('Reservation', ReservationSchema);