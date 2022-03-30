const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { findQuiz } = require('../middleware/find');
const Question = require('../models/question');
const Quiz = require("../models/quiz");
const prefix = "/:quizId/questions";

router.get(`${prefix}/`, [auth, admin, findQuiz], async (req, res) => {
  
  const questions = await Question.find(
    { quiz: req.params.quizId });
  res.send(questions);
});

router.post(`${prefix}/`, [auth, admin, findQuiz], async (req, res) => {
  try {
    const question = await Question.create({
      quiz: req.params.quizId,
      valeur: req.body.valeur,
      type: req.body.type,
      answers: req.body.answers
    });
    const quiz = await Quiz.findById({_id: question.quiz})
    console.log(quiz.title) ;
    quiz.questionsQuiz.push(question);
    await quiz.save();
    res.send(question);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get(`${prefix}/:id`, [auth, admin, findQuiz], async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).send('Question with submitted ID not found');
  }
  res.send(question);
});

router.put(`${prefix}/:id`, [auth, admin, findQuiz], async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).send('Question with submitted ID not found');
  }
  try {
    const updated_question = await question.update({
      question: req.body.question,
      answer: req.body.answer
    });
    res.send(updated_question);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete(`${prefix}/:id`, [auth, admin, findQuiz], async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).send('Question with submitted ID not found');
  }
  await question.destroy();
  res.send(question);
});

module.exports = router;
