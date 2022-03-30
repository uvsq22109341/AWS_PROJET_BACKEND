const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const findQuiz  = require('../middleware/find');
const calculateScore = require('../middleware/calculateScore');
const UserQuiz = require('../models/userquiz');
const UserAnswer= require('../models/answer');
const  Quiz = require('../models/quiz');
const  User = require('../models/users');

router.get('/', auth, async (req, res) => {
  const user_id = req.user.id;
  const user_quizzes = await UserQuiz.find(
    { user: user_id },
    );
  res.send(user_quizzes);
});

router.post('/', [auth], async (req, res) => {
   try {
      let user_quiz = await UserQuiz.create({
    score: 0,
    time: req.body.time,
    user: req.user.user_id,
    quiz: req.body.quiz
  });
  
    const quiz = await Quiz.findById({_id: req.body.quiz})
    quiz.userquizzes.push(user_quiz);
    await quiz.save();
     const user = await User.findOne({_id: req.user.user_id})
     console.log(user.user_name);
    user.userquizzes.push(user_quiz);
    await user.save();
    res.send(user_quiz);
  } catch (err) {
    res.status(400).send(err);
  }
 
 
}); 

router.get('/:id', auth, async (req, res) => {
  const user_quiz_id = req.params.id;
  const user_quiz = await UserQuiz.findById(user_quiz_id);
  if (!user_quiz) {
    res.status(404).send('UserQuiz with submitted ID not found');
  } else {// Check for current user
    if (req.user.id !== user_quiz.user) {
      res.status(403).send('Forbidden');
    } else {
      res.send(user_quiz);
    }
  }
});  

router.put('/:id', [auth, admin , calculateScore], async (req, res) => {
  let user_quiz = await UserQuiz.findOne( {_id: req.params.id });
  if (!user_quiz) {
     res.status(404).send('UserQuiz with submitted ID not found');
  } else if (req.user.user_id === user_quiz.user) {
     res.status(403).send("impossible car vous n'etes pas l'utilisateur");
  }

  try {
    const updated_user_quiz = await user_quiz.update({
      score: req.score,
      time: req.body.time,
      user: req.user.user_id,
      quiz: req.body.quiz
    });
    res.send(updated_user_quiz);
  } catch(err) {
    res.status(400).send(err);
  }
});  

router.delete('/:id', [auth, admin], async (req, res) => {
  const user_quiz = await UserQuiz.findOne({ id: req.params.id  });
  if (!user_quiz) {
    res.status(404).send('UserQuiz ID not found');
  } else {
    const quiz = await Quiz.find(user_quiz.quiz);

    var index = quiz.userquizzes.indexOf(user_quiz);
    if (index > -1) {
      quiz.userquizzes.splice(index, 1);
    }

    const user = await User.find(user_quiz.user);
    
    var index = user.userquizzes.indexOf(user_quiz);
    if (index > -1) {
      user.userquizzes.splice(index, 1);
    }
    await quiz.save();
    await user.save() ;
    await user_quiz.destroy(); // Auto-deletes user-answers
    res.send(user_quiz);
  }
});



module.exports = router;
