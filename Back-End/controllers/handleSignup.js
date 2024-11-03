const signupuserSchema=require("../models/signUpSchema");
const mongoose=require("mongoose")
async function handleUserSignup(req,res){
    const {username, email, password}=req.body;
    
    if(!username||!email||!password){
        return res.status(400).json({msg:"Please enter all required fiels"})
    }

    try{
        const user=await signupuserSchema.create({
            username,
            email,
            password
        });
        console.log("user")
        return res.status(201).json({ msg: "User created successfully", user });
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }

}

module.exports={handleUserSignup}