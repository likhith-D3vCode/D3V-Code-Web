const express=require("express");
const loginRouter=express.Router();
const userdb=require("../models/signUpSchema");


loginRouter.post("/api",async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(400).json({ success: false, message: "Missing email or password" });
    }
 
    const token =await userdb.matchedpassword(email,password);
    if(token=="null"){
        console.log("user not found");
    } 
    
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });


    // Send a success response so the frontend can handle the redirect
    res.status(200).json({ success: true, message: "Login successful" });
    
   
})



module.exports=loginRouter