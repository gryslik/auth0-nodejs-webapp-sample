var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
        console.log(user, 'This user was not found');
	//return res.redirect('/login');
	return res.redirect('/user_not_found');
	}
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || 'user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
/*
router.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }

 console.log('returnTo', returnTo);

  var logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  //console.log('logouturl', logoutURL);
  //console.log('searchString', searchString);
  logoutURL.search = searchString;

  logoutURL = 'https://ai.actempire.com/crypto';
  console.log("logging out to: ", logoutURL);
  res.redirect(logoutURL);
});
*/

router.get('/logout', function(req, res){
 //console.log(process.env);

  var logoutUrl = process.env.LOGOUT_URL;

  if (process.env.LOGOUT_AUTH0 === 'true') {
    logoutUrl = 'https://' + process.env.AUTH0_DOMAIN + '/v2/logout?returnTo=' 
      + process.env.LOGOUT_URL + '&client_id=' + process.env.AUTH0_CLIENT_ID
      + (process.env.LOGOUT_FEDERATED === 'true'? '&federated' : '');
  }
  
  req.logout();
  console.log('logging out of: ',logoutUrl) 
  res.redirect(logoutUrl);
});



module.exports = router;
