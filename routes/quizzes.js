const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { findCategory } = require('../middleware/find');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Category = require('../models/category');

router.get('/', auth, async (req, res) => {
  const quizzes = await Quiz.find();
  res.send(quizzes);
});

router.post('/', [auth, admin, findCategory], async (req, res) => {
  try {
    const quiz = await Quiz.create({
      title: req.body.title,
      description: req.body.description,
      diffeculty : req.body. diffeculty ,
      category: req.category.id
    });
    const category = await Category.findById({_id: quiz.category})
    category.quizes.push(quiz);
    await category.save();
    res.send(quiz);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/:id', auth, async (req, res) => {
  let quiz;
  const id = req.params.id;

  if (req.user.admin === false) {
    quiz = await Quiz.findById(id);
  } else {
    quiz = await Quiz.findById(id);
  }

  if (!quiz) {
    res.status(404).send('Quiz with submitted ID not found');
  } else {
    res.send(quiz);
  }
});

router.put('/:id', [auth, admin, findCategory], async (req, res) => {
  const quiz = await Quiz.findOne({ id: req.params.id });
  if (!quiz) return res.status(404).send('Quiz with submitted ID not found');

  try {
    const updated_quiz = await quiz.update({
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      category: req.category.id
    });
    res.send(updated_quiz);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const quiz = await Quiz.findOne({id: req.params.id  });
  if (!quiz) return res.status(404).send('Quiz ID not found');

  await quiz.destroy(); // Auto-deletes questions
  res.send(quiz);
});

module.exports = router;
