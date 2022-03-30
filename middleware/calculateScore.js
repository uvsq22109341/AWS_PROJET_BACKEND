const Quiz = require('../models/quiz');
const Question = require("../models/question") ;
const UserAnswer = require("../models/answer") ;
const UserQuiz = require("../models/userquiz") ;

async function getScore(req, res, next) {
  let answers = {};
  let count = 0;
  let correct = 0;
  let qstion=[];
  const quiz = await Quiz.findById(req.body.quiz);
  const useranswr = await UserAnswer.findOne();
  if(useranswr.length===0) 
  {
    req.score=0;
    next() ;
  } 
  else{
  quiz.questionsQuiz.forEach( async(question) => {
    let qst = await Question.find(question);
     count++;
    answers[qst._id] = qst.answers;
  });
 
  const usrquiz= await UserQuiz.findById(req.params.id);
  usrquiz.useranswers.forEach((user_answer) => {
    if (user_answer.answer === answers[user_answer.question]) {
      user_answer.isCorrect = true;
      correct++;
    } else {
      user_answer.isCorrect = false;
    }
  });
  const score = correct/count;

  req.score = score;
  next();
}
}
One = (number) => {
  number++;
  return number;
}
module.exports = getScore;
