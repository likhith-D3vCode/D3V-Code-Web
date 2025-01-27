import { useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';

function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    progress:0,
    indexes: [{ title: '', youtubeLink: '' }],
  });
  const [image, setImage] = useState(null);

  const handleAddCourse = (e) => {
    e.preventDefault();
    const tokenauth = localStorage.getItem('authToken');

    // Prepare FormData for the request
    const formData = new FormData();
    formData.append('title', newCourse.title);
    formData.append('description', newCourse.description);
    formData.append('indexes', JSON.stringify(newCourse.indexes)); // Convert indexes to string
    formData.append('progress',newCourse.progress);
    if (image) {
      formData.append('image', image); // Add the image file
    }

    axios
      .post(`${BACKEND_URL}/post-course/add-course`, formData,{ headers: {
        Authorization: `Bearer ${tokenauth}`, 
      }, withCredentials: true })
      .then((response) => {
        alert('Course added successfully!');
        setCourses([...courses, response.data.course]);
        setNewCourse({ title: '', description: '',progress:0, indexes: [{ title: '', youtubeLink: '' }] });
        setImage(null);
      })
      .catch((error) => console.error('Error adding course:', error));
  };

  const handleIndexChange = (index, field, value) => {
    const updatedIndexes = [...newCourse.indexes];

    
    updatedIndexes[index][field] = value;
    setNewCourse({ ...newCourse, indexes: updatedIndexes });
  };

  const addNewIndex = () => {
    setNewCourse({ ...newCourse, indexes: [...newCourse.indexes, { title: '', youtubeLink: '' }] });
  };

  return (
    <div>
      <h1>Course Manager</h1>

      {/* Add New Course */}
      <form onSubmit={handleAddCourse} encType="multipart/form-data">
        <h2>Add Course</h2>
        <input
          type="text"
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          required
        />
        <h3>Indexes</h3>
        {newCourse.indexes.map((index, i) => (
          <div key={i}>
            <input
              type="text"
              placeholder="Index Title"
              value={index.title}
              onChange={(e) => handleIndexChange(i, 'title', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="YouTube Link"
              value={index.youtubeLink}
              onChange={(e) => handleIndexChange(i, 'youtubeLink', e.target.value)}
              
              required
            />
          </div>
        ))}
        <button type="button" onClick={addNewIndex}>
          Add New Index
        </button>
        <div>
          <input type="number" value={newCourse.progress}   onChange={(e) => setNewCourse({ ...newCourse, progress: e.target.value })}  placeholder='enter total progress' />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
          />
        </div>
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}

export default CourseManager;
