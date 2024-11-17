// models/UserLikesSchema.js
const mongoose = require('mongoose');

const UserLikesSchema = new mongoose.Schema({
  question: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' }]
}, { timestamps: true });

module.exports = mongoose.model('UserLikes', UserLikesSchema);
