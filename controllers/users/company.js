var express = require('express');
var router = express.Router();
var mongoose = require('../../lib/mongoose');

router.get('/', (req, res, next) => {
	res.render('company');
});

router.post('/', (req, res, next) => {
	console.log(req.body);
	res.status(200).send("OK");
});

module.exports = router;
