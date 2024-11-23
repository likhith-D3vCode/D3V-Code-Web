const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL for the course image
    required: true,

  },
  indexes: [
    {
      title: { type: String, required: true }, // Title of the course index
      description: { type: String }, // Optional description of the index
      youtubeLink: { type: String, required: true }, // YouTube link for the index
    },
  ],
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, // Reference to the user
      progress: { type: Number, default: 0 }, // User's progress percentage
    },
  ],
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
