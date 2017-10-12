var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/Page1', function(req, res, next) {
  res.render('Game1.ejs');
});

router.get('/Page2', function(req, res, next) {
  res.render('Game2.ejs');
});

router.get('/Page3', function(req, res, next) {
  res.render('Game3.ejs');
});

router.get('/Page4', function(req, res, next) {
  res.render('Game4.ejs');
});

module.exports = router;
