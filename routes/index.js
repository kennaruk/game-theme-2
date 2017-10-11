var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/Page1', function(req, res, next) {
  res.render('Game1.ejs');
});



module.exports = router;
