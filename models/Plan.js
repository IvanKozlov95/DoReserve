var mongoose = require('../lib/mongoose'),
    Schema   = mongoose.Schema,
    log 	 = require('../util/log')(module),
    async 	 = require('async');

var TableSchema = new Schema({
	number: Number,
	x: Number,
	y: Number,
	r: Number
});

var PlanSchema = new Schema({
	company: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Company'
	},
	tables: [ TableSchema ],
	objects: [{
		name: String,
		x: Number,
		y: Number
	}]
});

PlanSchema.methods.update = function(items, cb) {
	var self = this;

	async.each(items.tables, updateTable.bind(self), function(err) {
		if (err) cb(err);

		self.save(cb);
	});
}

PlanSchema.methods.findTable = function(id, cb) {
	var table = this.tables.id(id);

	cb(null, table);
}

function updateTable (table, callback) {
	var res = this.tables.id(table.id);

	if (res) {
		res.x = table.x;
		res.y = table.y;
		res.r = table.r;
		res.number = table.number;
	} else {
		log.warn('Couldn\'t find a table with id: ' + table.id);
		this.tables.push(table);
	}

	callback();
}

PlanSchema.static.create = function (options, cb) {
	log.info(options);
	var plan = new PlanSchema({
		company: options.company
	});

	plan.tables.concat(options.tables);
	// plan.update(options, cb);
	plan.save(cb);
}

mongoose.model('Plan', PlanSchema);