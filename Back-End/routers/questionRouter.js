const express=require("express");
const router=express.Router();
const handlequestions =require('../controllers/handleQuestions');

router.post("/api",handlequestions);


module.exports=router