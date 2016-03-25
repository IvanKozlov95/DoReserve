var express = require('express');
var Server = require('./lib/server');
var log = require('util/log')(module);
require('shelljs/global');
var server_port = process.env.PORT || 1337;
var server = new Server(server_port);

if (exec('gulp').code == 0) {
	server.run();
}