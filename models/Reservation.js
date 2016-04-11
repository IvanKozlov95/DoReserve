var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema;

var ReservationSchema = new Schema({
	client: {
		type: Schema.Types.ObjectId,
		ref: 'Client'
	},
	plan: {
		type: Schema.Types.ObjectId,
		required: true
	},
	table: {
		type: Schema.Types.ObjectId,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	time: {
		from: Number,
		to: Number
	},
	persons: Number,
	order: Schema.Types.ObjectId
});

ReservationSchema.static.create = function(options, cb) {
	var res = new ReservationSchema({
						plan: options.planId,
						table: options.tableId,
						date: options.date,
						time: {
							from: options['start-time'],
							to: options['end-time']
						},
						persons: options.persons
					});

	res.save(cb);
}

//todo:
//	implement order

mongoose.model('Reservation', ReservationSchema);