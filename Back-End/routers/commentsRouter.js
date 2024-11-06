const express=require("express");
const commentsRouter = express.Router(); // Fixed typo here
const Comment=require("../models/commentsSchema");


commentsRouter.get("/api/:Id",async(req,res)=>{
      const response=await Comment.find({factsId:req.params.Id}).populate("createdBy");

      return res.status(200).json({response});
});


module.exports=commentsRouter
