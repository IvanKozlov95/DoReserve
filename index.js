var Server = require('./lib/server');
var config = require('./config');

var server = new Server(config.get('port'));

server.run();