const express=require("express");
const client=require('../redis/client')
const commentsRouter = express.Router(); // Fixed typo here
const Comment=require("../models/commentsSchema");


commentsRouter.get("/api/:Id",async(req,res)=>{
      
      const cachedData = await client.get("comments");
       
      if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

      const response=await Comment.find({factsId:req.params.Id}).populate("createdBy","-password");
       
      await client.setex("comments", 300, JSON.stringify({ response }));

      return res.status(200).json({response});
});


module.exports=commentsRouter
