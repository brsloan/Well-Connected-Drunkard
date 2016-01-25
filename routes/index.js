var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.JWT_SECRET, userProperty: 'payload'});

var path = process.cwd();
var UserHandler = require(path + '/controllers/userHandler.server.js');
var userHandler = new UserHandler();
var BarHandler = require(path + '/controllers/barHandler.server.js');
var barHandler = new BarHandler();

router.param('user', userHandler.getByName);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/bars/packaged/:location', barHandler.getBarsWithUserData);

router.get('/:user/', userHandler.getUser);
router.put('/:user/profile', auth, userHandler.setProfileInfo);
router.get('/:user/bars', userHandler.getUserBars);
router.put('/:user/bars/add/:bar', auth, userHandler.addBar);
router.delete('/:user/bars/remove/:bar', auth, userHandler.removeBar);
router.get('/:user/location/', userHandler.getLocation);
router.put('/:user/location/:location', auth, userHandler.setLocation);

router.post('/register', userHandler.register);
router.post('/login', userHandler.logIn);

module.exports = router;