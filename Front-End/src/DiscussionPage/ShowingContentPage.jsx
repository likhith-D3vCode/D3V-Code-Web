import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
 import './ShowingContent.css';

const ShowingContent = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [displaycomments, setdisplayComments] = useState([]);

  const fetchQuestion = async () => {
    const response = await axios.get(`http://localhost:9000/OneDiscussion/DiscussOnequestions/${id}`);
    
    const questionObject =response.data;

    console.log(questionObject[0].createdBy.username)
    // const questionArray = Object.entries(questionObject); // Convert object to array
   
    setQuestion(questionObject[0]);
    
    setComments(response.data.comments || []);
  };

  const handleComment = async () => {
    await axios.post(`http://localhost:9000/postcomments/question/${id}/comment`, { comment },{withCredentials:true});
    setComment('');
    fetchQuestion();
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

 

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/getPostedcomments/DiscussOnequestions/${id}/comments`);
      console.log(response.data)
      setdisplayComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);



  if (!question) return <div>Loading...</div>;

  return (
    <div className="question-detail">
      <h1 >{question.title}</h1>
      <div className="content-section">
      <div className="user-info">
  <div className="user-symbol">
    {/* Display the first letter of the username */}
    <div className="user-initials">
      {question.createdBy.username.charAt(0).toUpperCase()}
    </div>
  </div>
  <p>{question.createdBy.username}</p>
</div>  <h2>Details:</h2>
        <ol>
          {question.content.split('.').map((point, index) =>
            point.trim() ? <li key={index}>{point.trim()}.</li> : null
          )}
        </ol>
      </div>
      <div className="comments-section">
      <div className="comments-container">
      <h3>Comments</h3>
      {displaycomments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        displaycomments.map((comment, index) => (
          <div key={index} className="comment-item">
            <p>{comment.text}</p>
            <span>
              By: <strong>{comment.username}</strong> | {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
        <h3>Comments</h3>
        {comments.map((c, index) => (
          <div key={index} className="comment">
            <p>{c.text}</p>
            <span>By: {c.anonymous ? 'Anonymous' : c.user} | {new Date(c.createdAt).toLocaleString()}</span>
          </div>
        ))}
        <textarea
          placeholder="Add a comment..."
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className='button1' onClick={handleComment}>Submit</button>
      </div>
    </div>
  );
};

export default ShowingContent;
