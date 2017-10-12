var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./mock_db.js');
router.use(session({
  secret: 'cstu32-theme-2',
  resave: true,
  saveUninitialized: true
}));

var auth = (req, res, next) => {
  if(req.session.user)
    return next();
  else
    return res.redirect('/');
};

router.get('/', (req, res, next) => {
  res.send('/ page');
});

router.post('/login', (req, res, next) => {
  console.log(req.body);
  var key = req.body.key;

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
      res.send({success: true, key: payload.key});      
    }
  });

});

router.get('/:key/question', (req, res, next) => {
  var payload = {
    question: req.session.question
  }
  res.send({payload: payload});
});

router.post('/:key/question', (req, res, next) => {
  var answer = req.body.answer;
  var key = req.params.key;

  if(answer === req.session.answer) {

    db.updateStatusByKey(key, err => {
      if(err)
        res.send({error: true, msg: 'got some err from server please contact admin.'});
      else 
        res.send({correct: true});
    });

  }
  else
    res.send({correct: false});
    
});

router.get('/:key/image', (req, res, next) => {
  res.send({image: req.session.image});
});


module.exports = router;
