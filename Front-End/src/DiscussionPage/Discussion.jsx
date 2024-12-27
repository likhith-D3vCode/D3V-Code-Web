import { useState, useEffect } from 'react';
import axios from 'axios';
import './Discuss.css';
import { useNavigate } from 'react-router-dom';
import RedimadeNavBar from '../HomePage/RedimadeNavBar';
import { FaSearch, FaPlus, FaPaperPlane } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';

const Discussion = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [postContent, setPostContent] = useState({
    title: '',
    content: '',
    tags: '',
    anonymous: false,
  });

  const categories = ['All', 'Share Ideas', 'Help Center', 'Mentorship', 'Feedback Hub'];

  const fetchQuestions = async () => {
    const response = await axios.get('http://localhost:9000/GetDiscussR/DiscussGetquestions', {
      params: {
        search,
        ...(selectedCategory && selectedCategory !== 'All' && { contentName: selectedCategory }),
      },
    });
    setQuestions(response.data);
  };

  const handlePost = async () => {
    if (!postContent.title.trim() || !postContent.tags.trim() || !postContent.content.trim()) {
      alert("Please fill out all the fields before posting.");
      return;
    }
  
    // Post logic
    await axios.post('http://localhost:9000/PostDiscussR/questions', {
      ...postContent,
      tags: postContent.tags.split(',').map((tag) => tag.trim()),
      contentName: selectedCategory,
    }, { withCredentials: true });
  
    // Reset the post content and close the form
    setPostContent({ title: '', tags: '', anonymous: false, content: '' });
    setNewPostVisible(false);
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, selectedCategory]);

  return (
    <>
      <RedimadeNavBar />
      <div className="container">
        <h1>Discussion Board</h1>
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
       
        <div className="search-bar-container">
  <div className="search-bar">
    {search === '' && <FaSearch className="search-icon" />} {/* Render icon only if input is empty */}
    <input
      type="text"
      placeholder="   Search topics or comments..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>


        <div className="action-bar">
          <button className="new-post-button" onClick={() => setNewPostVisible(true)}>
            <FaPlus /> New Post
          </button>
        </div>
        {newPostVisible && (
  <>
    <div className="overlay"></div> {/* Overlay for dimming background */}
    <div className="post-container">
      <div className="post-container-header">
        <input
          type="text"
          className="title-input"
          placeholder="Enter topic title..."
          value={postContent.title}
          onChange={(e) =>
            setPostContent({ ...postContent, title: e.target.value })
          }
        />
        <div className="post-actions">
          <button onClick={() => setNewPostVisible(false)} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="submit-button"
            disabled={!postContent.title.trim() || !postContent.tags.trim() || !postContent.content.trim()}
          >
            Post <FaPaperPlane />
          </button>
        </div>
      </div>
      <input
  type="text"
  placeholder="Tag your topic"
  value={postContent.tags}
  onChange={(e) =>
    setPostContent({ ...postContent, tags: e.target.value })
  }
  style={{
    width: "95%",
    marginBottom: "10px", // Space between input and textarea
  }}
/>

<textarea
  placeholder="Share your thoughts or code snippets here..."
  rows="8"
  value={postContent.content}
  onChange={(e) =>
    setPostContent({ ...postContent, content: e.target.value })
  }
  style={{
    width: "95%",
  }}
></textarea>

      <div className="options">
        <label>
          <input
            type="checkbox"
            checked={postContent.anonymous}
            onChange={(e) =>
              setPostContent({
                ...postContent,
                anonymous: e.target.checked,
              })
            }
          />
          Post anonymously
        </label>
      </div>
    </div>
  </>
)}




<div className="questions">
  <h2>All Posts</h2>
  <div className="post-list-container">
    {questions.length > 0 ? (
    <ul className="post-list">
    {questions.map((question) => (
      <li
        key={question._id}
        className="post-list-item"
        onClick={() => navigate(`/showingDiscussionContent/${question._id}`)}
      >
        <div className="post-content">
          <div className="post-header">
            <h3 className="post-title">{question.title}</h3>
            <div className="tags-container">
              {question.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="post-details">
            Created By: {question.username && question.username.trim() ? 'Anonymous' : question.createdBy.username} |
            Created At: {new Date(question.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="icons-container">
          <div className="eye-icon-container">
            <FaEye className="eye-icon" />
            <span className="eye-count">{question.views}</span>
          </div>
          <div className="replies-icon-container">
            <FaPaperPlane className="replies-icon" />
            <span className="replies-count">{question.replies}</span>
          </div>
        </div>
      </li>
    ))}
  </ul>
  
   
   
   
   
    ) : (
      <p className="no-posts">No posts available. Start by creating a new post!</p>
    )}
  </div>
</div>
      </div>
    </>
  );
};

export default Discussion;
