
const mongoose = require("mongoose") ;
const questionSchema = new mongoose.Schema(
    {
        valeur:{
            type:String,
            unique: true,
            required:true,
        },
        type:{
            type: String,
            required: true
            
        },
        answers :{
            type : String,
            required: true
        },
        quiz : {type : mongoose.Schema.Types.ObjectId,ref : 'Quiz', required : false} ,
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

module.exports=mongoose.model('Question', questionSchema); 
