const mongoose=require('mongoose')
const Question=require('../models/questionsSchema');


const handledisplayQuestions=async (req,res)=>{
        
         try{

            const questions=await Question.find({});
            if(questions.length===0){
                return res.status(404).json({msg:`No questions found in the database`});
            }else{
                return res.status(200).json({questions});
            }

         }catch(err){
                return res.status(500).json({msg:'error retrieving questions',error:err.message});
                
         }
}


module.exports=handledisplayQuestions;