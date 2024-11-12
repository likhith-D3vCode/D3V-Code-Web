const mongoose=require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose

const solvedQuestions=new mongoose.Schema({
     Question:{
        type:Schema.Types.ObjectId,
        ref:"WebQuestions",
        required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"UserDetails",
        required: true,
    },
    solvedAt: {
        type: Date,
        default: Date.now,  // Automatically set the timestamp when the question is marked as solved
      },
    }, {
      timestamps: true,  // Adds createdAt and updatedAt fields automatically
      unique: true,
})

solvedQuestions.index({ createdBy: 1, Question: 1 }, { unique: true });


const solvedQuestionsmodel=mongoose.model("solvedQuestionsByUser",solvedQuestions);

module.exports=solvedQuestionsmodel