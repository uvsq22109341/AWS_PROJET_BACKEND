const mongoose = require("mongoose") ;

const categorySchema = new mongoose.Schema(
    {
        valeur:{
            type:String,
            unique:true,
            required:true,
        },
        created: {
            type: Date,
            default: Date.now
          },
          quizes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
         }]

    }
) ;




 module.exports=mongoose.model('Category', categorySchema); 