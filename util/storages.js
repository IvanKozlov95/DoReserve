var multer = require('multer'),
 	mime   = require('mime'),
	crypto = require('crypto');

module.exports = {
	logoStorage: multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, __dirname + '/../public/logos');
		},
		filename: function(req, file, cb) {
			cb(null, crypto.createHmac('sha256', Date.now().toString()).update(file.fieldname)
				.digest('hex') + '.' + mime.extension(file.mimetype));
		}
	})
}