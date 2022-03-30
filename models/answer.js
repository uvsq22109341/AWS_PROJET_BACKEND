const mongoose = require("mongoose") ;
const useranswerSchema = new mongoose.Schema(
    {
     userquiz : { type : mongoose.Schema.Types.ObjectId, required : false, ref: 'UserQuiz'},
     question : {type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Question'},
     answer: {type : String, required: true},
     isCorrect : {type : Boolean , required : true},
     created: {
         type: Date,
         default: Date.now
       }
    } 
 ) ; 
 module.exports= mongoose.model('UserAnswer', useranswerSchema); 