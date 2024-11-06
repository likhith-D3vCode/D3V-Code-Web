const factsmodel=require("../models/factsSchema");

const handleFacts=async(req,res)=>{
       const {facts}=req.body;
try{
    const response=await factsmodel.create({
        facts
      });
      return res.status(200).json({msg:"success"});
}catch(err){
    console.log("error in creating db",err)
    return res.status(401).json({msg:"failed to create mb"});
}
       
      
}


const getHandleFacts=async(req,res)=>{

    try{

        const allfacts=await factsmodel.find({});
        return res.status(200).json(allfacts);

    }catch(err){
       console.log("unable to fectch the data from db");
       return res.status(400).json({msg:"failed to get the data"});
    }

}

module.exports={handleFacts,getHandleFacts}
