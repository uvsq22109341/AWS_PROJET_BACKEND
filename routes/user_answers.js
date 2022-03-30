const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { findQuestion, findUserQuiz } = require('../middleware/find');
const UserAnswer = require('../models/answer');
const UserQuiz = require('../models/userquiz');
const Question = require('../models/question');

const prefix = '/:userQuizId/user-answers';
router.post(`${prefix}/`, [auth, findQuestion, findUserQuiz], async (req, res) => {
  try {
    const useranswer = await UserAnswer.create({
      question: req.body.question,
      answer: req.body.answer,
      isCorrect: req.body.isCorrect,
      userquiz: req.params.userQuizId
    });
    const userquiz = await UserQuiz.findById({_id: req.params.userQuizId})
    userquiz.useranswers.push(useranswer);
    const question = await Question.findById({_id: req.body.question}) ;
    question.useranswers.push(useranswer);
    await userquiz.save();
    await question.save();

    res.send(useranswer);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put(`${prefix}/:id`, [auth, admin, findQuestion, findUserQuiz], async (req, res) => {
  const user_answer = await UserAnswer.findOne( { id: req.params.id } );
  if (!user_answer) {
    return res.status(404).send('User Answer with submitted ID not found');
  }

  try {
    const updated_user_answer = await user_answer.update({
      question: req.body.question,
      answer: req.body.answer,
      isCorrect: req.body.isCorrect,
      userquiz: req.params.userQuizId
    });
    const userquiz = await UserQuiz.findById({_id: req.params.userQuizId})
    userquiz.useranswers.push(updated_user_answer);
    await userquiz.save();
    const question = await Question.findOne(req.body.question) ;
    question.useranswers.push(updated_user_answer);
    await question.save();

    res.send(updated_user_answer);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete(`${prefix}/:id`, [auth, admin, findUserQuiz], async (req, res) => {
  const user_answer = await UserAnswer.findOne({id: req.params.id  });
  if (!user_answer) {
    return res.status(404).send('User Answer with submitted ID not found');
  }
  await user_answer.destroy();
  res.send(user_answer);
});

module.exports = router;
