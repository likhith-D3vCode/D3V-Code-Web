import  { useState, useEffect } from 'react';
import axios from 'axios';
import './Discuss.css';
import { useNavigate } from 'react-router-dom';
import RedimadeNavBar from '../HomePage/RedimadeNavBar';


const Discussion = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [postContent, setPostContent] = useState({
    title: '',
    content:'',
    tags: '',
    anonymous: false,
  });

  const categories = ['all','Share Ideas', 'Help Center', 'Mentorship', 'Feedback Hub'];



  const fetchQuestions = async () => {
    const response = await axios.get('http://localhost:9000/GetDiscussR/DiscussGetquestions', {
      params: {
        search,
        ...(selectedCategory && selectedCategory !== 'all' && { contentName: selectedCategory }),
      },
    });
    
    setQuestions(response.data);
  };

  const handlePost = async () => {
    // Post logic
    await axios.post('http://localhost:9000/PostDiscussR/questions', {
      ...postContent,
      tags: postContent.tags.split(',').map((tag) => tag.trim()),
      contentName: selectedCategory, 
    },{withCredentials:true});
    setPostContent({ title: '', tags: '', anonymous: false, content: '' });
    setNewPostVisible(false); // Close the form after posting
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, [search,selectedCategory]);

  return (
    <>
    <RedimadeNavBar/>
    <div className="container">
      <h1>All Interview Questions</h1>
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="tabs">
        <span>Front end</span>
        <span>Back End</span>
        <span>Front end(FameWorks)</span>
      </div>
      <input
      className='input1'
        type="text"
        placeholder="Search topics or comments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        <button className="button1" onClick={() => setNewPostVisible(true)}>New +</button>
        {newPostVisible && (
          <div className="post-interface">
            <input
            className='input1'
              type="text"
              placeholder="Enter topic title..."
              value={postContent.title}
              onChange={(e) =>
                setPostContent({ ...postContent, title: e.target.value })
              }
            />
            <input 
            className='input1'
              type="text"
              placeholder="Tag your topic (e.g. 'facebook', 'binary-search'...)"
              value={postContent.tags}
              onChange={(e) =>
                setPostContent({ ...postContent, tags: e.target.value })
              }
            />
            <textarea className='textarea1'
              placeholder="If you want to include code in your post, please surround your code block with 3 backticks (```). For example:\n```\ndef helloWorld():\n    pass\n```"
              rows="8"
              value={postContent.content}
              onChange={(e) =>
                setPostContent({ ...postContent, content: e.target.value })
              }
            ></textarea>
            <div className="options">
              <label>
                <input
                className='input1'
                  type="checkbox"
                  checked={postContent.anonymous}
                  onChange={(e) =>
                    setPostContent({
                      ...postContent,
                      anonymous: e.target.checked,
                    })
                  }
                />
                Appear as anonymous to other users
              </label>
            </div>
            <div className="buttons">
              <button  onClick={() => setNewPostVisible(false)} className="close-button">
                Close
              </button>
              <button  onClick={handlePost} className="post-button">
                Post
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="questions">
        {questions.map((question) => (
          <div key={question._id} className="question">
            <h3  onClick={() => navigate(`/showingDiscussionContent/${question._id}`)} style={{ cursor: 'pointer', color: 'blue' }}  >{question.title}</h3>
            <p>
              Tags: {question.tags.join(', ')} | Created By:{question.anonymous ? 'Anonymous' : question.username}{' '}
              | Views: {question.views} | Replies: {question.replies}|CreatedAt:{new Date(question.createdAt).toLocaleString()}
            </p>
            <p>Last Reply: {new Date(question.lastReply).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Discussion;
