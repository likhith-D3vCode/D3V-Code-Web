const mongoose=require('mongoose');
const QuestionSchema=require('../models/questionsSchema');

 const handlequestions=async (req,res)=>{
  
    try{
        const {id,title,difficulty, description, Requirements, AcceptanceCriteria,TestCases,language}=req.body;

        const questions=await QuestionSchema.create({
            id,
            title,
            difficulty,
            description,
            Requirements,
            AcceptanceCriteria,
            TestCases,
            language
        });

       return res.status(201).json({msg:'Question created successfully'});
    }catch(err){
       console.log("error occured while creating question",err);
      return res.status(500).json({
        msg:'failed to create question'
       });
    }

      
};

module.exports=handlequestions;