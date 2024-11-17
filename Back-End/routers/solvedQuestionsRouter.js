const express = require("express");
const solvedquestionsByUser = express.Router();
const solved = require("../models/solvedquestions");

solvedquestionsByUser.post("/api", async (req, res) => {
      
    const {Question}=req.body;
    const createdBy=req.user._id

    try {

        const existingSolved = await solved.findOne({ Question });
         
        if (existingSolved) {
            // If already solved, return a message
            return res.status(200).json({ message: 'Question already solved' });
          }
         await solved.create({
            Question,
            createdBy
         });

        return res.status(200).json({msg:"user solved the problem"});
    } catch (err) {
        console.log(err);
        return res.status(400).json({msg:"user not solved the problem"});
    }
});


solvedquestionsByUser.get("/getapi",async(req,res)=>{
       

    try{

        const data=await solved.find({})
        return res.status(200).json({msg:"user solved questions data",data})


    }catch(err){
        console.log(err)
        return res.status(400).json({msg:"unable to get the data"});

    }


})

solvedquestionsByUser.get("/getOneQnapi", async (req, res) => {
    const { questionId } = req.query; // Extract questionId from query parameters
  
    try {
      const solvedQuestion = await solved.findOne({ Question: questionId })
  
      if (solvedQuestion) {
        return res.status(200).json({ solved: true });
      } else {
        return res.status(200).json({ solved: false });
      }
    } catch (error) {
      console.error("Error fetching solved status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });




module.exports=solvedquestionsByUser;