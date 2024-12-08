const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose


const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"UserDetails"
}, // Assuming this stores the username
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const DiscussSchema = new mongoose.Schema({
    title: String,
    content:{
    type :String
    },
    tags: [String],
    contentName: String,
    createdBy:{
      type:Schema.Types.ObjectId,
      ref:"UserDetails"
  },
  
    createdAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    lastReply: Date,
    comments: [CommentSchema],
  });
  
  const DiscussModel = mongoose.model('Question', DiscussSchema);

  module.exports=DiscussModel