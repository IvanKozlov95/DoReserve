var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema;

var PlanSchema = new Schema({
	tables: [{
		number: Number,
		x: Number,
		y: Number,
		r: Number
	}],
	objects: [{
		name: String,
		x: Number,
		y: Number
	}]
});

PlanSchema.methods.toJSON = function() {
	
}

mongoose.model('Plan', PlanSchema);