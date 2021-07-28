var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render('user', {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'Profile page'
  });
});


router.get('/user_not_found', function(req, res, next) {
  // res.send('This user is not found!')
//  console.log(req.user);
/*  const { _raw, _json, ...userProfile } = req.user;
  res.render('user_not_found', {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'User Not Found'
  });*/
  res.render('user_not_found', {
    title: 'User Not Found'
   });
});

module.exports = router;

