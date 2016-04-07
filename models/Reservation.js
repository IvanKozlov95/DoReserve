var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema;

var ReservationSchema = new Schema({
	table: {
		type: Schema.Types.ObjectId,
		required: true
	},
	from: {
		type: Date,
		required: true
	},
	to: {
		type: Date,
		required: true
	},
	persons: Number,
	order: Schema.Types.ObjectId
});

//todo:
//	implement order

mongoose.model('Reservation', ReservationSchema);