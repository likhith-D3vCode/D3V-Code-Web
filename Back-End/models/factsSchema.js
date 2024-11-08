const mongoose=require("mongoose");

const factsDb=new mongoose.Schema({
     facts:{
        type:String,
        required:true
     }
})

const factsmodel=mongoose.model("FactsDB",factsDb);

module.exports=factsmodel