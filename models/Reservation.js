var mongoose = require('../lib/mongoose'),
	Schema   = mongoose.Schema,
	async 	 = require('async'),
	mailer = require('../util/mailer');


var statuses = {
	0: 'New',
	1: 'Pending',
	2: 'Resolved',
	3: 'Rejected'
}

var ReservationSchema = new Schema({
	client: { type: Schema.Types.ObjectId, required: true, ref: 'Client' },
	company: { type: Schema.Types.ObjectId, required: true, ref: 'Company' },
	date: { type: Date, required: true },
	message: String,
	time: { type: String, required: true },
	persons: Number,
	order: Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	status: { type: Number, default: 0}
});

ReservationSchema.statics.create = function(options, cb) {
	var Client = mongoose.model('Client');
	var Company = mongoose.model('Company');
	var cleintEmail, companyEmail;
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
		if (err) return cb(err);

		async.parallel([(callback) => {
			if (options.client) {
				Client.findById(options.client, (err, client) => {
						if (err) return callback(err);
						if (!client) {
							log.warn('There is no such client ' + options.client);
							return callback("Client not found");
						}

						cleintEmail = client.email;
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

				companyEmail = company.email;
				company.addReservation(reservation.id, callback);
			});
		}], (err) => {
			if (err) return cb(err);


			mailer({
				from: companyEmail,
				to: cleintEmail,
				subject: 'New Reservation',
				html: '<p>Your reservation\'ve just been created.</p><p>Curren status is: ' + statuses[res.status] + '</p><p><a href="http://localhost:8080">Link</a></p>'
			});

			cb(null, reservation);
		});
	});
}

ReservationSchema.methods.refresh = function(options, cb) {
	this.date = options.date || this.date;
	this.persons = options.persons || this.persons;
	this.time = options.time || this.time;
	this.updateStatus(options.status);
	this.save(cb);
}

ReservationSchema.methods.getStatus = function() {
	return statuses[this.status];
}

ReservationSchema.methods.updateStatus = function(status) {
	var Client = mongoose.model('Client');
	var Company = mongoose.model('Company');

	if (this.status == status) return;

	this.status = status;
	// sending emails
	async.parallel([
			(callback) => {
				Client.findById(this.client, callback);
			},
			(callback) => {
				Company.findById(this.company, callback);
			}
		], (err, result) => {
			if (err) log.error(err);

			mailer({
				from: result[1].email,
				to: result[0].email,
				subject: 'Reservation status',
				html: '<p>Your reservation\'s have just been updated.</p><p>Curren status is: ' + statuses[this.status] + '</p><p><a href="http://localhost:8080">Link</a></p>'
			});
		});

	log.info('Reservation\'s status been updated. Id: ' + this.id);
}

ReservationSchema.methods.getCompany = function() {
	var Company = mongoose.model('Company');

	return new Promise((resolve, reject) => {
		Company
			.findById(this.company)
			.exec((err, company) => {
				if (err) reject(err);
				resolve(company.toJSON());
			});
	});
}

ReservationSchema.statics.statusList = function() { return statuses; }

//todo:
//	implement order

mongoose.model('Reservation', ReservationSchema);