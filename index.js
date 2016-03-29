var express = require('express');
var Server = require('./lib/server');
var log = require('util/log')(module);
var config = require('config');
require('lib/mongoose');

var server = new Server(config.get('port'));

server.run();