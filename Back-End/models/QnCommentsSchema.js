const mongoose=require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose

const QnCommentsSchema=new Schema({

    comments:{
        type:String,
        required:true
    },
    Question:{
        type:Schema.Types.ObjectId,
        ref:"WebQuestions"
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"UserDetails"
    },


},{timestamps:true})

const QuestionCommentsSchema=mongoose.model("QnComments",QnCommentsSchema);

module.exports=QuestionCommentsSchema