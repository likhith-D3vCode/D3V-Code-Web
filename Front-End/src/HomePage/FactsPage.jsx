import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../config";
import React from "react";
import {
  FaUserCircle,
  FaThumbsUp,
  FaCommentAlt,
  FaPaperPlane,
  FaTrophy,
  FaMedal,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa"; // Added social media icons
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./Factspage.css";
import expressImage from "../images/express.webp";
import react from "../images/react.webp"; // Adjust the path if necessary
import node from "../images/node.webp";

function FactsPage() {
  // const facts = Array(4).fill({
  //   text: "Did from mobile devices. This means it's essential to make your website responsive and mobile-friendly!",
  // });

  const [Dfacts, setFacts] = useState([]);

  const [comments, setComments] = useState({ content: "", likes: false });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const tokenauth = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `${BACKEND_URL}/check/api/check-auth`,
          {
            headers: {
              Authorization: `Bearer ${tokenauth}`, // Include the token in the Authorization header
            },
            withCredentials: true,
          }
        );

        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getFacts/api/get`);
        const factsArray = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);
        setFacts(factsArray);
        console.log(BACKEND_URL);
      } catch (err) {
        console.error("Error fetching facts and comments:", err);
      }
    };
    fetchFacts();
  }, []);

  // const [commentData, setCommentData] = useState({
  //   content: "",
  //   likes: false,
  // });

  const [getcommentData, getsetCommentData] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const [showCommentslength, setShowCommentslength] = useState(true);

  const handleCommentClick = async (id) => {
    if (showComments) {
      setShowComments(false);
    } else {
      try {
        // console.log("factsid", id);
        const responses = await axios.get(
          `${BACKEND_URL}/getComments/api/${id}`
        );

        // console.log("view comments array", responses.data.response);
        getsetCommentData(responses.data.response);
        setShowComments(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCommentChange = (e, factId) => {
    const { value } = e.target;
    setComments({
      ...comments,
      [factId]: value,
    });
  };

  const handleSubmitComment = async (factId, e) => {
    e.preventDefault(); // Prevent default form submission

    const tokenauth = localStorage.getItem("authToken"); // Get auth token
    const contentnew = comments[factId] || ""; // Get comment for the specific fact

    if (!contentnew.trim()) {
      console.error("Comment cannot be empty.");
      return; // Do not proceed if the comment is empty
    }

    try {
      // Prepare the payload based on the schema
      const payload = {
        content: contentnew,
        factsId: factId,
      };

      // Send the POST request
      const response = await axios.post(
        `${BACKEND_URL}/comments/api/${factId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${tokenauth}`, // Include token in headers
          },
          withCredentials: true,
        }
      );

      console.log("Success", response.data);

      // Reset comment for the current fact after successful submission
      setComments((prevComments) => ({
        ...prevComments,
        [factId]: "", // Clear the comment for the current fact
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const commentCounts = React.useMemo(() => {
    const counts = {};
    getcommentData.forEach((comment) => {
      counts[comment.factsId] = (counts[comment.factsId] || 0) + 1;
    });

    return counts;
  }, [getcommentData]);

  // const handleLikeClick = (index) => {
  //   setCommentData((prev) =>
  //     prev.map((data, idx) =>
  //       idx === index ? { ...data, liked: !data.liked } : data
  //     )
  //   );
  // };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          {/* Left Side Page */}
          <div className="col-md-8">
            <div className="mb-3">
              {/* Card Component */}
              {Dfacts.map((fact, index) => (
                <div className="card mb-3 shadow-sm card-fact" key={index}>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      {/* User icon */}
                      <FaUserCircle size={40} className="me-2" />
                      <h5 className="card-title mb-0">Posted by D3vCode</h5>
                    </div>

                    {/* Fact about web development */}
                    <p className="card-text">{fact.facts}</p>

                    {/* Like and Comment icons */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      {/* <div className="like-comment">
                        <FaThumbsUp className={`like-icon me-2 ${commentData[index].liked ? "liked" : ""}`} />
                        <span>Like</span>
                      </div> */}
                      {/* <div onClick={() => handleCommentClick(index)} className="comment-icon">
                        <FaCommentAlt className="me-2" />
                        <span>Comment</span>
                      </div> */}
                    </div>

                    {/* View Comments */}

                    <div className="mt-3">
                      <span
                        onClick={() => handleCommentClick(fact._id)}
                        className="view-comments"
                      >
                        {showComments[fact._id]
                          ? `Hide Comments${
                              commentCounts[fact._id]
                                ? ` (${commentCounts[fact._id]})`
                                : ""
                            }`
                          : `View Comments${
                              commentCounts[fact._id]
                                ? ` (${commentCounts[fact._id]})`
                                : ""
                            }`}
                      </span>

                      {showComments && (
                        <div className="mt-3 comment-containerofFacts">
                          {getcommentData.length > 0 ? (
                            getcommentData
                              .filter((comment) => comment.factsId === fact._id) // Filter comments by fact ID
                              .map((comment) => (
                                <div key={comment._id} className="comment">
                                  <p>
                                    <strong>
                                      {comment.createdBy.username}:
                                    </strong>{" "}
                                    {comment.content}
                                  </p>
                                </div>
                              ))
                          ) : (
                            <p>No comments to display.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Comment text box   ${commentData[index].comments.length} */}
                    {isAuthenticated && (
                      <div className="comment-input-container mt-3">
                        <textarea
                          className="form-control comment-textarea"
                          rows="1"
                          value={comments[fact._id]}
                          name="content"
                          onChange={(e) => handleCommentChange(e, fact._id)}
                          placeholder="Write your comment here..."
                          required
                        ></textarea>
                        <FaPaperPlane
                          className="submit-icon"
                          size={24}
                          onClick={(e) => handleSubmitComment(fact._id, e)}
                        />
                      </div>
                    )}

                    {/* Display Comments */}
                    {/* {commentData[index].showComment &&
                      commentData[index].comments.map((cmt, idx) => (
                        <div key={idx} className="mt-2 comment">
                          <FaUserCircle size={20} className="me-2" />
                          <span>{cmt}</span>
                        </div>
                      ))} */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Page */}
          <div className="col-md-4">
            {/* Add the contest texts with icons */}
            <div className="contest-container mb-2">
              <div
                className="d-flex align-items-center contest-item mb-2"
                onClick={() =>
                  window.open("https://example.com/biweekly-contest", "_blank")
                }
              >
                <FaTrophy className="contest-icon me-2" />
                <div className="contest-text">
                  In 7 days: <br />
                  Join our Biweekly Contest 141
                </div>
              </div>
              <div
                className="d-flex align-items-center contest-item"
                onClick={() =>
                  window.open("https://example.com/weekly-contest", "_blank")
                }
              >
                <FaMedal className="contest-icon me-2" />
                <div className="contest-text">
                  In 16 hours: <br />
                  Join our Weekly Contest 418
                </div>
              </div>
            </div>

            {/* Right-side cards displayed one by one with increased height and button */}
            {/* Right-side cards displayed one by one with increased height and button */}
            <div className="course-suggested-card mt-5">
              <div
                className="card right-card text-bg-light mb-3"
                style={{ backgroundImage: `url(${expressImage})` }}
              >
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/Study");
                  }}
                  style={{ cursor: "pointer" }}
                  className="btn card-btn"
                >
                  Go to course
                </a>
              </div>

              <div
                className="card right-card text-bg-light mb-3"
                style={{ backgroundImage: `url(${react})` }}
              >
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/Study");
                  }}
                  style={{ cursor: "pointer" }}
                  className="btn card-btn"
                >
                  Go to course
                </a>
              </div>

              <div
                className="card right-card text-bg-light mb-3"
                style={{ backgroundImage: `url(${node})` }}
              >
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/Study");
                  }}
                  style={{ cursor: "pointer" }}
                  className="btn card-btn"
                >
                  Go to course
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-dark text-white text-center p-4 mt-4">
        <div className="container">
          <h5 className="mb-3">About Us</h5>
          <p className="mb-4">
            We are dedicated to providing the best web development resources and
            tutorials.
          </p>
          <div className="social-icons mb-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaTwitter size={30} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaYoutube size={30} />
            </a>
          </div>
          <p className="mb-0">© 2024 D3vCode. All Rights Reserved.</p>
          <p>
            <a href="/privacy-policy" className="text-white">
              Privacy Policy
            </a>{" "}
            |
            <a href="/terms-of-service" className="text-white">
              {" "}
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default FactsPage;
