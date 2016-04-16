var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema;

var ReservationSchema = new Schema({
	// client: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Client'
	// },
	company: { type: Schema.Types.ObjectId, required: true },
	date: { type: Date, required: true },
	message: String,
	time: { type: String, required: true },
	persons: Number,
	order: Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	isResponsed: { type: Boolean, default: false }
});

ReservationSchema.statics.create = function(options, cb) {
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

	res.save(cb);
}

//todo:
//	implement order

mongoose.model('Reservation', ReservationSchema);