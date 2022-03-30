const mongoose = require("mongoose") ;
const userquizSchema = new mongoose.Schema(
    {
     user : { type : mongoose.Schema.Types.ObjectId, required : true, ref: 'User'},
     quiz : {type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Quiz'},
     score : {type : Number, required: true},
     time : {type : Number , required : true},
     useranswers : [{
      type: mongoose.Schema.Types.ObjectId,
      ref : 'UserAnswer'
    }],
     created: {
         type: Date,
         default: Date.now
       }
    } 
 ) ; 
 module.exports= mongoose.model('Userquiz', userquizSchema); 
