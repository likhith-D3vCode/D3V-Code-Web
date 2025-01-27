import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CompilerFrame from "../Frame-Work-Compiler/CompilerFrameWork";
import WebCompiler from "../Web_compiler/WebCompiler";
import "./PracticePage.css";
import axios from "axios";
import BACKEND_URL from '../config';

function PracticePage() {
  const location = useLocation(); // Get the state passed from the Link
  const {
    title,
    description,
    Requirements,
    AcceptanceCriteria,
    TestCases,
    _id,
  } = location.state || {}; // Destructure title and description
  const [activeComponent, setActiveComponent] = useState("framework");
  const [showComments, setshowComments] = useState(true);
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState([]);
  const outputRef = useRef(null);

  useEffect(() => {
    async function fetchSolvedUsers() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/getsolvedquestionsByuser/getapi`
        );
        console.log(response.data);

        // Check if response.data has the 'data' array
        if (response.data && Array.isArray(response.data.data)) {
          // Extract unique user IDs based on 'createdBy' field
          const uniqueUsers = new Set(
            response.data.data.map((item) => item.createdBy)
          );
          setUniqueUsersCount(uniqueUsers.size); // Count of unique users
        }
      } catch (error) {
        console.error("Error fetching solved questions data:", error);
      }
    }

    fetchSolvedUsers();
  }, []);

  const handleLikeToggle = async () => {
    const tokenauth = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/Userlikes/posts/like`,
        { question: _id },
        { 
          headers: {
            Authorization: `Bearer ${tokenauth}`, // Include the token in the Authorization header
          },withCredentials: true }
      );
      // setLikesCount(response.data.likes);
      console.log(response);
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const getInitials = (name) => {
    console.log(name);
    if (!name) return "NN"; // Default fallback
    const nameParts = name.split(" ");
    const initials =
      nameParts.length > 1
        ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
        : nameParts[0][0].toUpperCase() + nameParts[0][1]?.toUpperCase();
    return initials;
  };

  useEffect(() => {
    async function fetchLikes() {
      const tokenauth = localStorage.getItem('authToken');

      try {
        const response = await axios.get(
          `${BACKEND_URL}/likesget/getTheLikes/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${tokenauth}`, 
            }, withCredentials: true }
        );
        console.log("likes", response.data.ans);
        const initialLikesCount = response.data.likes[0]?.likes.length || 0;
        console.log("likesjdffvbjkb", initialLikesCount);
        setLiked(response.data.ans);
        setLikesCount(initialLikesCount);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    }

    fetchLikes();
  }, [_id, handleLikeToggle]);

  const [usercomments, setUserComments] = useState({
    comments: "",
  });

  const [getuserdata, setGetuserdata] = useState([]);

  const handleOnClick = () => {
    // e.preventDefault();
    if (showComments === true) {
      setshowComments(true);
      scrollToOutput();
    }
  };

  const handleChange = (e) => {
    setUserComments({
      ...usercomments,
      [e.target.name]: e.target.value,
    });
  };

  const scrollToOutput = () => {
    if (outputRef.current) {
      console.log("clicked");
      outputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getusercomments = async () => {
    try {
      console.log("dfjkghj", _id);
      const userdata = await axios.get(
        `${BACKEND_URL}/getQuestionsComments/getApi/${_id}`
      );
      const userdataArray = Array.isArray(userdata.data)
        ? userdata.data
        : Object.values(userdata.data);

      setGetuserdata(userdataArray);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    const tokenauth = localStorage.getItem('authToken');

    e.preventDefault();

    try {
      console.log("data", usercomments);
      await axios.post(
        `${BACKEND_URL}/QuestionsComments/api/${_id}`,
        usercomments,
        { headers: {
          Authorization: `Bearer ${tokenauth}`, 
        }, withCredentials: true }
      );

      setUserComments({
        comments: "",
      });
    } catch (error) {
      console.log(error);
    }

    getusercomments();
  };
  useEffect(() => {
    getusercomments();
  }, []);

  return (
    <>
      {/* <div className="container TopContainer"></div> */}
      <div className="TotalContainer">
        <div className="discription">
          <div className="TopclsAbove">
            <div className="Topcls">
              {/* <h4>{title}</h4> Display the question title */}
              <p className="SubmissionText">Submissions ({uniqueUsersCount})</p>

              {/* <button className="number"></button> */}

              <div className="like-container">
                <button className="like-button" onClick={handleLikeToggle}>
                  <span className={`heart-icon ${liked ? "liked" : ""}`}>
                    <i className="bi bi-heart-fill"></i>
                  </span>
                </button>
                <p className="likes-count">
                  {likesCount} {likesCount === 1 ? "likes" : "likes"}
                </p>
              </div>
              <p className="commentsCss">
                <p className="commentsCounts">{getuserdata.length}</p>
                <i
                  onClick={() => handleOnClick()}
                  className="bi bi-chat-text-fill"
                ></i>
              </p>
            </div>
            <p className="questionTitle">{title}</p>
          </div>
          {/* <p>Description</p> */}
          <p className="questionDescription">{description}</p>{" "}
          {/* Use the description from the Link */}
          <i>
            {" "}
            <h6 className="questionRequirements">Requirements:</h6>
          </i>
          {Requirements.map((req, index) => (
            <div key={index}>
              <p className="questionSectionTitle">{req.sectionTitle}</p>
              <p className="questionSectionContent">{req.sectionContent}</p>
            </div>
          ))}
          <i>
            <h6 className="questionRequirements">Acceptance Criteria:</h6>
          </i>
          {AcceptanceCriteria.map((criteria, index) => (
            <p className="questionsCriteria" key={index}>
              {criteria.Criteria1}
            </p>
          ))}
          {showComments && (
            <div className="questionComments" ref={outputRef}>
              <p>
                Comments <i className="bi bi-chat-text"></i>
              </p>

              <div className="questionCommentsDiv">
                <textarea
                  type="text"
                  name="comments"
                  rows="8"
                  value={usercomments.comments}
                  placeholder="Enter the comments"
                  onChange={handleChange}
                  required
                />

                <button onClick={(e) => handleSubmit(e)}>Send</button>
              </div>
            </div>
          )}
          <div className="mt-3 comment-container">
            {getuserdata.length > 0 ? (
              getuserdata.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    {comment.createdBy.profileImg ? (
                      <div className="comment-avatar-fallback">
                        {getInitials(comment.createdBy.username)}
                      </div>
                    ) : (
                      <img
                        src={comment.createdBy.profileImg}
                        alt="User Avatar"
                        className="comment-avatar"
                      />
                    )}
                    <p className="comment-username">
                      {comment.createdBy.username}
                    </p>
                  </div>
                  <div className="questionCommentsContent">
                  <p className="comment-content">{comment.comments}</p>
                  </div>
                  
                </div>
                
              ))
            ) : (
              <p>No comments</p>
            )}
          </div>
        </div>
        <div className="rightSideE">
          {/* Buttons to switch between components */}
          <div className="button-container">
            <button onClick={() => setActiveComponent("framework")}>
              Framework
            </button>
            <button
              className="htmlButton"
              onClick={() => setActiveComponent("html/css/js")}
            >
              <i className="bi bi-code-square"></i>HTML/CSS/JS
            </button>
          </div>

          {/* Conditionally render the components based on activeComponent */}
          {activeComponent === "framework" && <CompilerFrame />}
          {activeComponent === "html/css/js" && (
            <WebCompiler TestCases={TestCases} questionId={_id} questionDescription={description} questionCriteria={AcceptanceCriteria} questionRequirement={Requirements}/>
          )}
        </div>
      </div>
      {/* <div className="SubTest"><h5>Test Cases</h5><button className="btn btn-primary">Submit</button></div> */}
    </>
  );
}

export default PracticePage;
