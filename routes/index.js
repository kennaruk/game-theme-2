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
  var key = req.params.key;
  
  if(key !== req.session.key) {
    res.redirect('/'+req.session.key+'/question');
  } else {
    var payload = {
      question: req.session.question
    }

    res.send({payload: payload});
  }
 
});

router.post('/:key/question', (req, res, next) => {
  var answer = req.body.answer;
  var key = req.params.key;
  if(key !== req.session.key) {
    res.redirect('/'+req.session.key+'/question');
  } else if(answer === req.session.answer) {

    db.updateStatusByKey(key, err => {
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
  if(key !== req.session.key) 
    res.redirect('/'+req.session.key+'/image');
  else
    res.send({image: req.session.image});
});


module.exports = router;
