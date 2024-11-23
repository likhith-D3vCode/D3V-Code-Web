const express = require('express');
const router = express.Router();
const Course = require('../models/coursesSchema'); // Assuming courseSchema is in models folder
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose'); // Required for ObjectId conversion




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../Front-End/public/CourseImages')); // Destination folder in React frontend
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
  



// Add a new course
router.post('/add-course', upload.single('image'), async (req, res) => {
    const userId=req.user._id;
   
    console.log(userId)
  try {
    
    const { title, description, indexes } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const parsedIndexes = JSON.parse(indexes);
    const newCourse = new Course({
      title,
      description,
      image,
      indexes:parsedIndexes,
      users: [{ userId, progress: 0 }],
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ error: 'Error adding course' });
  }
});


// Get all courses
router.get('/courses', async (req, res) => {
  const userId=req.user._id;


  try {
    const courses = await Course.find({});
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const filteredCourses = courses.map((course) => {
      const userProgress = course.users.find(user => user.userId.equals(userObjectId));
      return { ...course._doc, progress: userProgress.progress };
    });
    
    res.json(filteredCourses);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching courses' });
  }


});

// Update user progress
router.post('/update-progress', async (req, res) => {
  const userId=req.user._id;
  try {

    const { id , progress } = req.body;
  console.log(req.body)
    const course = await Course.findById(id);
   
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const userProgress = course.users.find(user => user.userId.toString() === userId);
    
    if (userProgress) {
      userProgress.progress = progress;
    } else {
      course.users.push({ userId, progress });
    }

    await course.save();
    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating progress' });
  }
});



router.get('/progress/:courseId', async (req, res) => {
  const { courseId} = req.params;
  const userId=req.user._id;

  try {
      // Find the course by ID
      const course = await Course.findById(courseId);

      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }
      
      // Convert userId to ObjectId for comparison
      const userObjectId = new mongoose.Types.ObjectId(userId);

      console.log(userObjectId); // Debugging: Confirm the converted ObjectId
      console.log(course.users); // Debugging: Check the users array in the course
      // Find the user's progress in the course
      
      const userProgress = course.users.find(user => user.userId.equals(userObjectId));



      console.log(userProgress)
      if (!userProgress) {
          return res.status(404).json({ message: 'User progress not found for this course' });
      }

      // Return the progress
      res.status(200).json({
          courseId: course._id,
          title: course.title,
          userId: userId,
          progress: userProgress.progress,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;
