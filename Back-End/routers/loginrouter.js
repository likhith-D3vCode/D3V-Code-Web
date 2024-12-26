const express=require("express");
const loginRouter=express.Router();
const userdb=require("../models/signUpSchema");
const multer = require('multer');
const path = require('path');
const { createHmac, randomBytes } = require('crypto');

loginRouter.post("/api",async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(400).json({ success: false, message: "Missing email or password" });
    }
 
    const token =await userdb.matchedpassword(email,password);
    if(token=="null"){
        console.log("user not found");
    } 
    
    res.cookie('token', token, {
        httpOnly: true,       // Prevents JavaScript access to the cookie
        secure: false,        // Set `true` in production to use HTTPS
        sameSite: "lax",      // Ensures cookies are sent on the same domain (adjust as needed)
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });


    // Send a success response so the frontend can handle the redirect
    res.status(200).json({ success: true, message: "Login successful" });
    
   
})



loginRouter.get("/userdata/api",async(req,res)=>{
    const userid=req.user._id;
    try{
        const userdata=await userdb.find({_id:userid})
        return res.status(201).json({msg:"user data",userdata})

    }catch(err){
        return res.status(401).json({msg:"user not found in the back end"})

    }
})

loginRouter.get("/oneuser/api", async (req, res) => {
    const userid = req.user._id;
    try {
        // Select only the 'username' field from the database
        const userdata = await userdb.findById(userid);
        
        if (!userdata) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User data", userdata });

    } catch (err) {
        return res.status(500).json({ msg: "Error fetching user data", error: err.message });
    }
});





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../Front-End/public/UserImages')); // Destination folder in React frontend
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });



  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });





  loginRouter.put('/updateUser',upload.single('image'), async (req, res) => {
    try {
        const { username, email ,phoneNo, skills, education} = req.body;

         
        const profileImg = req.file ? req.file.filename : null;
        const userId =req.user._id;

         // Fetch the existing user data
         const existingUser = await userdb.findById(userId);
         if (!existingUser) {
             return res.status(404).json({ message: 'User not found' });
         }

        // Parse skills and education if provided as JSON
        // const parsedSkills = skills ? JSON.parse(skills) : [];
        // const parsedEducation = education ? JSON.parse(education) : [];



        const updateFields = {
          username: username || existingUser.username,
          email: email || existingUser.email,
          profileImg: profileImg || existingUser.profileImg,
          phoneNo: phoneNo || existingUser.phoneNo,
         skils:skills !== '[""]'
          ? JSON.parse(skills).map(skill => ({ addskills: skill }))
          : existingUser.skils, // Use existing skills if new skills are not provided
        Education:education !== '[{"schoolName":"","year":"","score":"","place":""}]'
          ? JSON.parse(education).map(edu => ({
              schoolName: edu.schoolName,
              year: edu.year,
              score: edu.score,
              place: edu.place,
            }))
          : existingUser.Education, //
      };

       




        const updatedUser = await userdb.findByIdAndUpdate(
          userId,
          { $set: updateFields }, // Use $set to update only specified fields
          { new: true } // Return the updated document
      );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ msg: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});








module.exports=loginRouter