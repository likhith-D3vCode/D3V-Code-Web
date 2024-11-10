const express = require("express");
const QuestionCommentsRouter = express.Router();
const QuestionCommentsSchema = require("../models/QnCommentsSchema");

QuestionCommentsRouter.post("/api/:qnId", async (req, res) => {
    try {
        // Check if req.user is defined
        if (!req.user || !req.user._id) {
            return res.status(401).json("User not authenticated");
        }

        if(!req.body.comments){
            return res.status(401).json({msg:"comment field is required"})
        }

        await QuestionCommentsSchema.create({
            comments: req.body.comments,
            Question: req.params.qnId,
            createdBy: req.user._id,
        });

        return res.status(200).json("Comment posted");
    } catch (err) {
        console.log(err);
        return res.status(400).json("Error: Comment not posted");
    }
});


QuestionCommentsRouter.get("/getApi/:qnid",async(req,res)=>{
    
   try{

      const commentsdata= await QuestionCommentsSchema.find({Question:req.params.qnid}).populate("createdBy")
      return res.status(200).json(commentsdata);

   }catch(err){

      return res.status(400).json({msg:"error occured"})

   }

})


module.exports = QuestionCommentsRouter;
