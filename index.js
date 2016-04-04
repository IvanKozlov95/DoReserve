var Server = require('./lib/server');
var log = require('./util/log')(module);
var config = require('./config');

var server = new Server(config.get('port'));

server.run();