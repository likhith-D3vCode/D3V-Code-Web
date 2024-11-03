const express=require("express");
const SignupRouter=express.Router();
const {handleUserSignup}=require("../controllers/handleSignup");
SignupRouter.post("/user",handleUserSignup);


module.exports=SignupRouter;
