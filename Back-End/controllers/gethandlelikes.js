// controllers/userLikesController.js
const UserLikes = require("../models/UserLikesSchema");

exports.getTheLikes = async (req, res) => {
  const userId = req.user._id; // Assume `req.user` contains the authenticated user's data

  try {
    
      const likes=await UserLikes.find({ question: req.params.questionId });

      const likeExists = await UserLikes.exists({ question: req.params.questionId, likes: userId });
    

     if(likeExists)  
      return res.status(200).json({msg:"all likes",likes,ans:true});

     return res.status(200).json({msg:"all likes",likes,ans:false});


    

   
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};
