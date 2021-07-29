/**
 * This is an example middleware that checks if the user is logged in.
 *
 * If the user is not logged in, it stores the requested url in `returnTo` attribute
 * and then redirects to `/login`.
 *
 */
module.exports = function () {
  return function secured (req, res, next) {
    if (req.user) { return next(); }
    req.session.returnTo = req.originalUrl.substring(1); //get rid of first / to make user instead of /user for proper redirect under proxy
    console.log('secured_returnTo:',req.session.returnTo);
    //req.session.returnTo = req.originalUrl;
    res.redirect('login');
  };
};
