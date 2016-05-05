exports.mustAuthenticated = function (req, res, next){
  req.isAuthenticated()
    ? next()
    : res.redirect('/');
};

exports.mustCompany = function(req, res, next) {
	(req.isAuthenticated() && req.user.__t == 'Company')
		? next()
		: res.redirect('/');
}

exports.mustClient = function(req, res, next) {
	(req.isAuthenticated() && req.user.__t == 'Client')
		? next()
		: res.redirect('/');
}

exports.mustAnon = function(req, res, next) {
	req.isAuthenticated()
		? res.redirect('/')
		: next();
}

exports.mustClientOrAnon = function(req, res, next) {
	(req.isAuthenticated() && req.user.__t == 'Company')
		? res.redirect('/')
		: next();
}