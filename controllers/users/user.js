var express   = require('express'),
	router 	  = express.Router(),
	auth 	  = require('../../middleware/authMw'); 

router.get('/home', auth.mustAuthenticated, function(req, res, next) {
	res.redirect('/' + req.user.__t + '/home');
});

module.exports = router;