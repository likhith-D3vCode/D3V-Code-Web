const mongoose=require("mongoose");
const { Schema } = mongoose; // Import Schema from mongoose

const commnetSchema=new Schema({

    content:{
        type:String,
        required:true
    },
    likes:{
      type:String,
    },
    factsId:{
        type:Schema.Types.ObjectId,
        ref:"FactsDB"
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"UserDetails"
    },


},{timestamps:true})

const commentModel=mongoose.model("CommentsAndLikes",commnetSchema);

module.exports=commentModel