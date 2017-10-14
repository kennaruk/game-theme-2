var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./mock_db.js');
router.use(session({
  secret: 'cstu32-theme-2',
  resave: true,
  saveUninitialized: true
}));

var imageAuth = (req, res, next) => {
  if(req.session.status)
    return next();
  else
    return res.redirect('/'+req.session.key+'/question');
};

router.get('/', (req, res, next) => {
  res.render('Game1.ejs');
});

router.get('/login', (req, res, next) => {
  res.render('Game2.ejs');
});

router.post('/login', (req, res, next) => {
  console.log(req.body);
  var key = req.body.key;
  key = key.trim().toLocaleLowerCase();
   
  db.getPayloadByKey(key, (err, payload) => {
    if(err)
      res.send({success: false});
    else {
      console.log('payload: ', payload);
      req.session.user = true;
      req.session.key = payload.key;
      req.session.question = payload.question;
      req.session.answer = payload.answer;
      req.session.status = payload.status;
      req.session.image = payload.image;
      req.session.index = payload.index;
      res.send({success: true, key: payload.key , status : payload.status});      
    }
  });

});

router.get('/:key/question', (req, res, next) => {
  var key = req.params.key;

  if(key !== req.session.key) {
    res.redirect('/'+req.session.key+'/question');
  } else {
    var payload = {
      key: req.session.key,
      question: req.session.question
    }

    res.render('Game3.ejs', {payload: payload});
  }
});
 
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

router.post('/:key/question', (req, res, next) => {
  var answer = req.body.answer;
  var key = req.params.key;
  key = key.trim().toLocaleLowerCase();

  if(key !== req.session.key) {
    res.redirect('/'+req.session.key+'/question');
  } else if(answer === req.session.answer) {

    db.updateStatusByKey(req.session.index, err => {
      if(err)
        res.send({error: true, msg: 'got some err from server please contact admin.'});
      else {
        req.session.status = true;
        res.send({correct: true});        
      }
    });

  }
  else
    res.send({correct: false});
    
});

router.get('/:key/image', imageAuth, (req, res, next) => {
  var key = req.params.key;
  if(key != req.session.key) 
    res.redirect('/'+req.session.key+'/image');
  else
    res.render('Game4.ejs', {image: req.session.image});
});


module.exports = router;
