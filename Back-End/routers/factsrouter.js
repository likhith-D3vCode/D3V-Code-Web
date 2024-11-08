const express=require("express");
const factsRouter=express.Router();
const {handleFacts,getHandleFacts} =require("../controllers/factsController");


factsRouter.post("/api",handleFacts);
factsRouter.get("/api/get",getHandleFacts)

module.exports=factsRouter
