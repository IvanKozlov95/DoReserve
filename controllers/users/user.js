var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User 	 = mongoose.model('User');
var log 	 = require('../../util/log')(module);





module.exports = router;