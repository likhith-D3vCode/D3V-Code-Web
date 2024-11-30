const express=require("express");
const router=express.Router();
const handlequestions =require('../controllers/handleQuestions');
const handledisplayQuestions=require('../controllers/displayQuestions')
router.post("/api",handlequestions);
const Question=require('../models/questionsSchema');


router.get("/get/api",handledisplayQuestions)

router.get("/get/topicwise/:Tname",async(req,res)=>{
          
    try{
        const questionsdata= await Question.find({ topicname: { $regex: req.params.Tname, $options: "i" } })
        return res.status(200).json({msg:"sucess",questionsdata});
    }catch(err){
        return res.status(401).json({msg:"backend error check the code"});
    }

})


module.exports=router