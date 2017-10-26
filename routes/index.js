var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./mock_db.js');
const answers = ["โรงศพ", "มากาลอง", "แผนที่", "grape", "28", "แตงโม", "หล่อ"];
const YEAR_INDEX = 0,
ID_INDEX = 1,
NAME_INDEX = 2,
NICKNAME_INDEX = 3,
SIZE_INDEX = 4,
ALLERGIC_INDEX = 5,
CODE_INDEX = 6,
PAYMENT_INDEX = 7,
SHIRT_INDEX = 8,
GROUP_INDEX = 9,
CAR_INDEX = 10,
QUESTION_INDEX = 11,
QUESTION_STATUS = 12,
ROW_INDEX = 13;

router.use(session({
  secret: 'cstu32-theme-2',
  resave: true,
  saveUninitialized: true
}));

var imageAuth = (req, res, next) => {
  if(req.session.status === "ถูก")
    return next();
  else
    return res.redirect('/question');
};

var auth = (req, res, next) => {
  if(req.session.user)
    return next();
  else
    res.redirect('/');
}
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
   
  db.getPayloadByKey(key, (err, row) => {
    if(err)
      res.send({success: false});
    else {
      // console.log('payload: ', payload);
      req.session.user = true;
      req.session.key = row[ID_INDEX];
      req.session.question = parseInt(row[QUESTION_INDEX]);
      req.session.nickname = row[NICKNAME_INDEX];
      req.session.answer = answers[parseInt(row[QUESTION_INDEX])-1];
      req.session.status = row[QUESTION_STATUS];
      req.session.index = row[ROW_INDEX];
      console.log(req.session);
      res.send({success: true, nickname: req.session.nickname, status: (req.session.status === "ถูก")});      
    }
  });

});

router.get('/question', (req, res, next) => {

    switch(req.session.question) {
      case 1:
        res.render('questions/question-1.ejs');
        break;
      case 2:
        res.render('questions/question-2.ejs');
        break;  
      case 3:
        res.render('questions/question-3.ejs');
        break;
      case 4:
        res.render('questions/question-4.ejs');
        break;  
      case 5:
        res.render('questions/question-5.ejs');
        break;
      case 6:
        res.render('questions/question-6.ejs');
        break;  
      case 7:
        res.render('questions/question-7.ejs');
        break;
      default:
        res.redirect('/');
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

router.post('/question', (req, res, next) => {
  var answer = req.body.answer;
  console.log('answer: ', answer);
  console.log('sesans: ', req.body.answer.trim().toLocaleLowerCase());
  if(answer === req.session.answer.trim().toLocaleLowerCase()) {
    
    db.updateStatusByKey(req.session.index, err => {
      if(err)
        res.send({error: true, msg: 'got some err from server please contact admin.'});
      else {
        req.session.status = "ถูก";
        res.send({correct: true});        
      }
    });

  }
  else
    res.send({correct: false});
    
});

router.get('/image', imageAuth, (req, res, next) => {
    res.render('Game4.ejs');
    // res.send({wow: true});
});


module.exports = router;
