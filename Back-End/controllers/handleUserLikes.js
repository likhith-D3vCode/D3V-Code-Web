// controllers/userLikesController.js

const UserLikes = require("../models/UserLikesSchema");

exports.toggleLike = async (req, res) => {
  const { question } = req.body;
  const userId = req.user._id; // Assume `req.user` contains the authenticated user's data

  try {
    // Find the question in the UserLikes collection
    let userLike = await UserLikes.findOne({ question });

    let user = await UserLikes.findOne({ userId });

    if (!userLike) {
      // If the question doesn't exist, create a new record with the question and the first like
      userLike = await UserLikes.create({ question, likes: [userId] });
      return res.status(200).json({ success: true, message: 'Liked', likesCount: userLike.likes.length });
    }

    

    // Check if the user already liked the question
    const isLiked = userLike.likes.includes(userId);
    
    if (isLiked) {
      // If already liked, remove the user's like (unlike)
      userLike.likes = userLike.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // If not liked, add the user's like
      userLike.likes.push(userId);
    }

    // Save the updated like/unlike status
    await userLike.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Unliked' : 'Liked',
      likesCount: userLike.likes.length
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'Server Error', error });
  }


};
