module.exports = function (list) {
	list = list || [];
	return function(req, res, next) {
		// Checks if properties in req body exists
		console.log('list ' + list);
		for (var i = 0; i < list.length; i++) {
			// console.log(checkField(list[ind], req));
			if ( !checkField(list[i], req) ) {
				return res.status(400).send('Please, fill field ' + list[i]);
			} 
		}
	}
}

function checkField(fieldName, req) {
	var l = fieldName.split('|');
	for (var i = 0; i < l.length; i++) {
		if ( req.body[l[i]] ) {
			return true;
		}
	}

	console.log(l);
	return false;
}