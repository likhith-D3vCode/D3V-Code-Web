const express=require("express");
const router=express.Router();
const handlequestions =require('../controllers/handleQuestions');
const handledisplayQuestions=require('../controllers/displayQuestions')
router.post("/api",handlequestions);

router.get("/get/api",handledisplayQuestions)

module.exports=router