const express = require('express');
const router = express.Router();
const Course = require('../models/coursesSchema'); // Assuming courseSchema is in models folder
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose'); // Required for ObjectId conversion
const client=require('../redis/client')




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
   
  
  try {
    
    const { title, description, indexes,progress } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    

    const parsedIndexes = JSON.parse(indexes);
    const newCourse = new Course({
      title,
      description,
      image,
      progress,
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
  const userId = req.user._id;
  
  const cachedData = await client.get("courses");

  if (cachedData) {
    return res.json(JSON.parse(cachedData));
}

  try {
    const courses = await Course.find({});
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const filteredCourses = courses.map((course) => {
      const userProgress = course.users.find(user => user.userId.equals(userObjectId));
      
      // Return course with user's progress if found, otherwise default progress
      return {
        ...course._doc,
        progress: userProgress ? userProgress.progress : 0, // Default progress to 0 if not found
      };
    });
    await client.setex("courses", 300, JSON.stringify({ filteredCourses }));

    res.json(filteredCourses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});







// Get all courses
router.get('/courses/index/:id', async (req, res) => {
  const userId = req.user._id;

  const cachedData = await client.get("coursesWithUsersSpecific");
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
}

  try {
    const courses = await Course.find({_id:req.params.id});
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const filteredCourses = courses.map((course) => {
      const userProgress = course.users.find(user => user.userId.equals(userObjectId));
      
      // Return course with user's progress if found, otherwise default progress
      return {
        ...course._doc,
        progress: userProgress ? userProgress.progress : 0, // Default progress to 0 if not found
        courseProgress: course.progress,
      };
    });
    await client.setex("coursesWithUsersSpecific", 300, JSON.stringify({ filteredCourses }));

    res.json(filteredCourses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});







// Update user progress
router.post('/update-progress', async (req, res) => {
  const userId=req.user._id;
  const cachedData = await client.get("update-progress");
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
}
  try {

    const { id , progress } = req.body;


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
    await client.setex("update-progress", 300, JSON.stringify({  message: 'Progress updated successfully' }));

    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating progress' });
  }
});



router.get('/progress/:courseId', async (req, res) => {
  const { courseId} = req.params;
  const userId=req.user._id;


  const cachedData = await client.get("courseID-progress");
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
}


  try {
      // Find the course by ID
      const course = await Course.findById(courseId);

      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }
      
      // Convert userId to ObjectId for comparison
      const userObjectId = new mongoose.Types.ObjectId(userId);

     
      
      const userProgress = course.users.find(user => user.userId.equals(userObjectId));


      console.log(userProgress)
     
      if (!userProgress) {
          return res.status(404).json({ message: 'User progress not found for this course' });
      }


      await client.setex("courseID-progress", 300, JSON.stringify({
        courseId: course._id,
        title: course.title,
        userId: userId,
        progress: userProgress.progress,
    }));

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



// Route to get course data and user progress
router.get("/getAllcourses", async (req, res) => {
  const userId=req.user._id;
  //  console.log(userId)

  const userCoursesKey = `courses:${userId}`; // Unique cache key for each user

  try {

    const cachedData = await client.get(userCoursesKey);
    if (cachedData) {
     
      return res.status(200).json({ success: true, courses: JSON.parse(cachedData) });
    }

    // Retrieve courses with progress data for the specified user
    const courses = await Course.find({
      "users.userId":new mongoose.Types.ObjectId(userId), // Filter courses where the user exists in the users array
    })
      .select("title description image indexes users") // Select only necessary fields
      .lean(); // Convert to plain JavaScript objects

    // Map courses to include user-specific progress
    const result = courses.map((course) => {
      const userProgress = course.users.find(
        (user) => user.userId.toString() === userId
      );


      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        image: course.image,
        indexes: course.indexes,
        progress: userProgress ? userProgress.progress : 0, // Include progress or 0 if not found
      };
    });
    await client.setex(userCoursesKey, 300, JSON.stringify({ success: true, courses: result }));

    res.status(200).json({ success: true, courses: result });
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
});

module.exports = router;





module.exports = router;
