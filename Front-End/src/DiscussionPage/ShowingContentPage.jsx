import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowingContent.css';
import BACKEND_URL from '../config';

const ShowingContent = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [comment, setComment] = useState('');
  const [displaycomments, setDisplayComments] = useState([]);

  const fetchQuestion = async () => {

    const response = await axios.get(
      `${BACKEND_URL}/OneDiscussion/DiscussOnequestions/${id}`
    );
    setQuestion(response.data[0]);
  };

  const handleComment = async () => {
    const tokenauth = localStorage.getItem('authToken');

    await axios.post(
      `${BACKEND_URL}/postcomments/question/${id}/comment`,
      { comment },
      {headers: {
        Authorization: `Bearer ${tokenauth}`, // Include the token in the Authorization header
      }, withCredentials: true }
    );
    setComment('');
    fetchComments();
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/getPostedcomments/DiscussOnequestions/${id}/comments`
      );
      setDisplayComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchComments();
  }, [id]);

  if (!question) return <div>Loading...</div>;

  return (
    <div className="sc-question-detail">
      <h1>{question.title}</h1>
      <div className="sc-content-section">
        <div className="sc-user-info">
          <div className="sc-user-avatar">
            {question.createdBy.username.charAt(0).toUpperCase()}
          </div>
          <p>{question.createdBy.username}</p>
        </div>
        <h2>Details:</h2>
        <ol>
          {question.content.split('.').map((point, index) =>
            point.trim() ? <li key={index}>{point.trim()}.</li> : null
          )}
        </ol>
      </div>
      <div className="sc-comments-section">
        <h3>Comments</h3>
        {displaycomments.length === 0 ? (
          <p className="sc-no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="sc-comments-list">
            {displaycomments.map((comment, index) => (
              <li key={index} className="sc-comment-item">
                <div className="sc-comment-text">{comment.text}</div>
                <div className="sc-comment-meta">
                  By: <strong>{comment.username}</strong> |{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="sc-textarea-container">
          <textarea
            className="sc-textarea"
            placeholder="Add a comment..."
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="sc-submit-button" onClick={handleComment}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowingContent;
