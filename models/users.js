const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name: { type: String, default: null },
  email: { type: String, unique: true },
  isAdmin :{type : Boolean,required:true, default:false},
  password: { type: String },
userquizzes : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'UserQuiz'
}],
  token: { type: String },
});

module.exports = mongoose.model("User", userSchema);