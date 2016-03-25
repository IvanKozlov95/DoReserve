'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Controllers = require('../controllers');
var log = require('../util/log')(module);

class Server {
	constructor(port) {
		this.port = port;
	}

	_initializeExpress() {
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/../views');

		app.use(express.static(__dirname + '/../public'));
		app.use(bodyParser.urlencoded({extended: true}));
		// app.use(cookieParser); // Doesn't work if uncomment

		app.use((req, res, next) => {
			log.info(req.method + ' ' + req.url);


			if (req.method === 'POST') {
				log.info('Request params: ' + req.body);
			}

			next();
		});

		app.use('/company', Controllers.Company);

		app.use((req, res, next) => {
			log.info('Unknown request url ' + req.url);
			res.status(404).send("Sorry, didn't find anything there.")
		});

		app.use((err, req, res, next) => {
			log.error(err);

			// check if instranse of mine errors

			res.status(500).send("Sorry. Internal server error.");
		})
	}

	run() {
		this._initializeExpress();
		app.listen(this.port);
		log.info("Server is listening on port " + this.port);
	}
}

module.exports = Server;