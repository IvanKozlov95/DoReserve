'use strict';

require('../models');

var express 	 = require('express');
var app 		 = express();
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session 	 = require('express-session');
var passport 	 = require('passport');
var Controllers  = require('../controllers');
var log 		 = require('../util/log')(module);
var mongoose  	 = require('./mongoose');

const MongoStore = require('connect-mongo')(session);

class Server {
	constructor(port) {
		this.port = port;
	}

	_initializeExpress() {
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/../views');
		app.locals.pretty = true;

		app.use(express.static(__dirname + '/../public'));
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(cookieParser()); 
		app.use(session({ 
			secret: "SECRET",
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({mongooseConnection: mongoose.connection})
		}));

		app.use(passport.initialize());
		app.use(passport.session());
		require('./passport');

		app.use((req, res, next) => {
			log.info(req.method + ' ' + req.url);

			if (req.method === 'POST') {
				log.info('Request params: ' + JSON.stringify(req.body));
			}

			next();
		});

		/*
		* Loading user to res.locals down here
		*/
		app.use(require('../middleware/loadUser'));

		/*
		* Loading controllers down here
		*/
		app.use('/company', Controllers.Company);
		app.use('/reservation', Controllers.Reservation);
		app.use('/user', Controllers.User);
		app.use('/user', Controllers.Client);
		app.use('/plan', Controllers.Plan);
		app.use('/table', Controllers.Table);
		app.use('/login', Controllers.login);
		app.use('/register', Controllers.register);
		app.use('/logout', Controllers.logout);

		app.use('/', function(req, res, next) {
			req.url == '/'
				? res.render('index')
				: next();
		});
		
		app.use((req, res, next) => {
			log.info('Unknown request url ' + req.url);
			res.status(404).send("Sorry, didn't find anything there.")
		});

		app.use((err, req, res, next) => {
			log.error(err);

			// check if instanse of my errors

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