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