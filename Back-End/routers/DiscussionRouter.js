const discussionModel=require("../models/discussion")
const express = require('express');
const Discussrouter = express.Router();

Discussrouter.get('/DiscussGetquestions', async (req, res) => {
    const { search,contentName  } = req.query;
    const query = {
      ...(search && { title: { $regex: search, $options: 'i' } }),
      ...(contentName && { contentName }),
    };
    const questions = await discussionModel.find(query).sort({ createdAt: -1 }).populate('createdBy', 'username');;
    res.json(questions);
  });
  
  Discussrouter.post('/questions', async (req, res) => {
    const userid=req.user._id;
    try {
      // Assuming req.user._id is populated by authentication middleware
       // Ensure user is authenticated
      
      if (!userid) {
        return res.status(401).json({ message: 'Unauthorized: User must be logged in.' });
      }
  
      // Create a new question
      const question = new discussionModel({
        ...req.body,
        createdBy: userid, // Attach user ID to the question
      });
  
      // Save the question to the database
      await question.save();
  
      res.status(201).json({ message: 'Question posted successfully', question });
    } catch (error) {
      console.error('Error posting question:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  

 
  Discussrouter.get('/DiscussOnequestions/:id', async (req, res) => {
    
    const questions = await discussionModel.find({_id:req.params.id}).populate("createdBy","username");
    res.json(questions);
  });


  Discussrouter.post('/question/:id/comment', async (req, res) => {
    const { comment } = req.body;
    const userid=req.user._id;
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }
  
    try {
      const question = await discussionModel.findById(req.params.id)
  
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      const newComment = {
        text: comment,
        createdBy: userid, // Add user from the request or default to 'Anonymous'
        anonymous: req.body.anonymous || false,
      };
  
      question.comments.push(newComment); // Add the comment
      question.replies += 1; // Increment replies count
      question.lastReply = new Date(); // Update last reply date
  
      await question.save();
      res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  Discussrouter.get('/DiscussOnequestions/:id/comments', async (req, res) => {
    try {
      const question = await discussionModel.findById(req.params.id).select('comments').populate("comments.createdBy","username"); // Fetch only the comments field
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      // Extract and format comments
      const formattedComments = question.comments.map(comment => ({
        text: comment.text,
        username: comment.anonymous ? 'Anonymous' : comment.createdBy?.username || 'Unknown',
        createdAt: comment.createdAt,
      }));
  
      res.status(200).json(formattedComments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



  module.exports=Discussrouter;
