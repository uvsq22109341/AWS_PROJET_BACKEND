const mongoose = require("mongoose") ;
const quizSchema = new mongoose.Schema(
   {
    title : { type : String, required : true},
    description : {type : String, required : false},
    category : {type : mongoose.Schema.Types.ObjectId, ref : 'Category', required: true},
    diffeculty : {type : Number , required : true},
    questionsQuiz : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Question'
    }],
    userquizzes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'UserQuiz'
    }],
    created: {
        type: Date,
        default: Date.now
      }
   } 
) ; 

module.exports = mongoose.model('Quiz', quizSchema); 