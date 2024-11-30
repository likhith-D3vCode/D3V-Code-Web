import { useState, useEffect } from 'react';
import "../Html.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const HtmlCourse = () => {
    const location = useLocation();
    const { index, title, id } = location.state || {};
    const navigate=useNavigate();
    const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/UB1O30fR-EE');
    const [activeTopic, setActiveTopic] = useState('');
    const [showVideo, setShowVideo] = useState(false);
    const [labLink, setLabLink] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open
    const [showBlogs, setShowBlogs] = useState(true); // State to toggle between video and blog cards
    const[timerper,setTimerper]=useState(0);


    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

   

    const [timer, setTimer] = useState(0); // Timer state in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer status

   
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/get-progress-api/progress/${id}`, { withCredentials: true });
                const { progress } = response.data;

                // Convert progress percentage to time (assuming 10,000 seconds as 100%)
                const resumedTime = Math.round((progress / 100) * 10000);
                setTimer(resumedTime);
                setIsTimerRunning(true); // Start the timer
            } catch (error) {
                console.error('Error fetching progress:', error);
            }
        };

        if (id) {
            fetchProgress();
        }
    }, [id]);




    useEffect(() => {
        const savedTimer = localStorage.getItem("htmlCourseTimer");
        if (savedTimer) {
            setTimer(parseInt(savedTimer)); // Set the timer to the saved value
            setIsTimerRunning(true); // Start the timer if it was previously running
        }
    }, []);

    // Save the timer state to localStorage whenever it changes
    useEffect(() => {
        if (isTimerRunning) {
            localStorage.setItem("htmlCourseTimer", timer); // Save the current timer state
        }
    }, [timer, isTimerRunning]);




    const playVideo = (url, topicId, labUrl) => {
        setVideoUrl(url);
        setActiveTopic(topicId);
        setLabLink(labUrl);
        setShowVideo(true); // Show video when a topic is clicked
        setShowBlogs(false); // Hide blog cards when video is shown
        toggleTimer();
    };

    const toggleDropdown = (topicId) => {
        setDropdownOpen(prevState => (prevState === topicId ? null : topicId)); // Toggle dropdown visibility
    };

    const handleMouseLeave = () => {
        setDropdownOpen(null); // Close the dropdown when the mouse leaves
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-menu') && !event.target.closest('.topic-name')) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    const goToLab = async(title) => {
        console.log(title)
        //  const name="introduction to css";
        
        const response=await axios.get(`http://localhost:9000/gettopicwise/get/topicwise/${title}`);

        console.log(response.data.questionsdata);
        navigate("/specificQuestions", { state: { questions: response.data.questionsdata } })
    };

    const handleCourseClick = () => {
        setShowBlogs(true); // Show blog cards when "HTML Course" is clicked
        setShowVideo(false); // Hide video section
    };

    // Timer effect
    useEffect(() => {
        let timerInterval;
        if (isTimerRunning) {
            timerInterval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerInterval);
        }
        return () => clearInterval(timerInterval);
    }, [isTimerRunning]);

    const toggleTimer = () => {
        setIsTimerRunning(true);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };


         // Calculate timer as a percentage of 1000
    const calculatePercentage = (timer) => {
        return(Math.min((timer / 10000) * 100, 100).toFixed(2)); // Return percentage formatted to 2 decimal places
    };


    
    const handleExit = () => {
        setIsExitModalOpen(true); // Show exit confirmation modal
        setTimerper(calculatePercentage(timer))


    };

    const confirmExit = async() => {

        try {
            // Prepare the data to send to the API
            const data = {
                id: id, // The id from location.state
                progress: timerper, // Timer percentage
            };

           
    
            // Make an API call to update the progress
            const response = await axios.post('http://localhost:9000/progressUp/update-progress',  data,{  withCredentials: true });
    
            if (response.ok) {
                // Handle successful response
                console.log('Progress updated successfully');
            } else {
                // Handle errors
                console.error('Failed to update progress');
            }
        } catch (error) {
            console.error('An error occurred while updating progress:', error);
        }
    
    
        setTimerper(calculatePercentage(timer))


        setIsTimerRunning(false); // Stop the timer when exiting
        setTimer(0)
        navigate("/study"); // Navigate to the study page
 
    };

    const cancelExit = () => {
        setIsExitModalOpen(false); // Close the exit confirmation modal
        setTimerper(calculatePercentage(timer))

    };


    useEffect(() => {
        let timerInterval;
        if (isTimerRunning) {
            timerInterval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerInterval);
        }
        return () => clearInterval(timerInterval);
    }, [isTimerRunning]);

   

    return (
        <div id="viewport">
            {/* Sidebar Section */}
            <div id="sidebar">
                <header>
                    <a href="#" onClick={handleCourseClick}>{title}</a>
                </header>
                <ul className="nav">
      {index.map((topic, index1) => (
        <li key={index1} onMouseLeave={handleMouseLeave}>
          <div
            className="topic-name"
            onClick={() => {playVideo(topic.youtubeLink, topic.title, "https://example.com/lab1");
                formatTime(timer)
            }}
          >
          <i className="zmdi zmdi-view-dashboard"></i> {topic.title}
          </div>
          <div
            className="dropdown-toggle"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(index1);
            }}
          >
            <span
              className={`arrow ${dropdownOpen === index1 ? 'open' : ''}`}
            ></span>
          </div>
          {dropdownOpen === index1 && (
            <ul className="dropdown-menu">
              <li onClick={() =>{ playVideo(topic.youtubeLink, topic.title, "https://example.com/lab1");
                 formatTime(timer)
                }
                }>
                Start Learning
              </li>
            
              <li onClick={() => goToLab(topic.title)}>Go to Lab</li>
            </ul>
          )}
        </li>
      ))}
    </ul>
            </div>

            {/* Content Section */}
            <div id="content">
                <div className="video-section">
                    {/* Conditionally render the video or blog cards */}
                    {showVideo ? (
                        <>
                            
                            <iframe id="topicVideo" src={videoUrl} allowFullScreen></iframe>
                             
                            <div className="video-controls">
                                <span className="timer-display"></span>
                             
                            </div>

                        </>
                    ) : (
                        showBlogs && (
                            <div className="blog-cards-container">
                                {/* Blog Card 1 */}
                                <div className="blog-card">
                                    <div className="meta">
                                        <div className="photo" style={{ backgroundImage: 'url(https://storage.googleapis.com/chydlx/codepen/blog-cards/image-1.jpg)' }}></div>
                                        <ul className="details">
                                            <li className="author"><a href="#">John Doe</a></li>
                                            <li className="date">Aug. 24, 2015</li>
                                            <li className="tags">
                                                <ul>
                                                    <li><a href="#">Learn</a></li>
                                                    <li><a href="#">Code</a></li>
                                                    <li><a href="#">HTML</a></li>
                                                    <li><a href="#">CSS</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="description">
                                        <h1>Learning to Code</h1>
                                        <h2>Opening a door to the future</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad eum dolorum architecto obcaecati enim dicta praesentium, quam nobis! Neque ad aliquam facilis numquam. Veritatis, sit.</p>
                                        <p className="read-more">
                                            <a href="#">Read More</a>
                                        </p>
                                    </div>
                                </div>

                                {/* Blog Card 2 */}
                                <div className="blog-card">
                                    <div className="meta">
                                        <div className="photo" style={{ backgroundImage: 'url(https://storage.googleapis.com/chydlx/codepen/blog-cards/image-2.jpg)' }}></div>
                                        <ul className="details">
                                            <li className="author"><a href="#">Jane Doe</a></li>
                                            <li className="date">Sept. 5, 2015</li>
                                            <li className="tags">
                                                <ul>
                                                    <li><a href="#">Frontend</a></li>
                                                    <li><a href="#">JavaScript</a></li>
                                                    <li><a href="#">Web</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="description">
                                        <h1>Building Web Pages</h1>
                                        <h2>From Scratch to Advanced</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad eum dolorum architecto obcaecati enim dicta praesentium, quam nobis! Neque ad aliquam facilis numquam. Veritatis, sit.</p>
                                        <p className="read-more">
                                            <a href="#">Read More</a>
                                        </p>
                                    </div>
                                </div>

                                {/* Add more blog cards as needed */}
                            </div>
                        )
                    )}
                </div>
            </div>
        
        {/* Exit Button */}
        <button onClick={handleExit} className="exit-button">Exit</button>

{/* Exit Confirmation Modal */}
{isExitModalOpen && (
    <div className="modal">
        <div className="modal-content">
            <p>Are you sure you want to exit?</p>
            <button onClick={confirmExit}>Exit</button>
            <button onClick={cancelExit}>Cancel</button>
        </div>
    </div>
)}

        </div>
    );
};

export default HtmlCourse;            