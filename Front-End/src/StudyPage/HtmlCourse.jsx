import { useState, useEffect } from 'react';
import "../Html.css";
import {  useNavigate } from "react-router-dom";
import axios from 'axios';
import { useParams } from "react-router-dom";
import BACKEND_URL from '../config';

const HtmlCourse = () => {
    // const location = useLocation();
    const { id} = useParams();
    // const { index, title, idd } = location.state || {};
    const navigate=useNavigate();
    const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/UB1O30fR-EE');
    const [activeTopic, setActiveTopic] = useState('');
    const [showVideo, setShowVideo] = useState(false);
    const [labLink, setLabLink] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open
    const [showBlogs, setShowBlogs] = useState(true); // State to toggle between video and blog cards
    const[timerper,setTimerper]=useState(0);
    const [indexes, setIndexes] = useState([]); // For storing index data specifically
    const [course, setCourse] = useState(null); // For storing entire course data
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [totalProgress,settotalProgress]=useState();
    const [timer, setTimer] = useState(0); // Timer state in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer status


    // useEffect(() => {
    //     const preventBackNavigation = () => {
    //         window.history.pushState(null, null, window.location.href);
    //         alert("Back navigation is disabled on this page!");
    //     };

    //     window.history.pushState(null, null, window.location.href);
    //     window.onpopstate = preventBackNavigation;

    //     return () => {
    //         window.onpopstate = null;
    //     };
    // }, []);




    // Block back navigation using history.pushState and popstate
    useEffect(() => {
        const preventBackNavigation = () => {
            window.history.pushState(null, null, window.location.href);
            alert("Back navigation is disabled on this page!, please use exit button in the page.");
        };

        window.history.pushState(null, null, window.location.href); // Push a new state to history
        window.onpopstate = preventBackNavigation; // Add popstate event listener

        // Cleanup on component unmount
        return () => {
            window.onpopstate = null; // Remove event listener
        };
    }, []);

    useEffect(() => {
        const tokenauth = localStorage.getItem('authToken');

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/CoursesIndex/courses/index/${id}`, { headers: {
                    Authorization: `Bearer ${tokenauth}`, 
                  },withCredentials: true });
                const  Courses  = response.data;

                //  console.log(Courses[0].courseProgress)
                 settotalProgress(Courses[0].courseProgress)
                 setCourse(Courses[0].title)
                 setIndexes(Courses[0].indexes)

            } catch (error) {
                console.error('Error fetching Courses:', error);
            }
        };

        
        fetchCourses();
        
    }, []);

   
    useEffect(() => {
        const fetchProgress = async () => {
            const tokenauth = localStorage.getItem('authToken');

            try {
                const response = await axios.get(`${BACKEND_URL}/get-progress-api/progress/${id}`, { headers: {
                    Authorization: `Bearer ${tokenauth}`, 
                  },withCredentials: true });
                const { progress } = response.data;
                 
                var total=totalProgress;
                
                const resumedTime = Math.round((progress / 100) * (total*60));
                // console.log('resumedfghjk',resumedTime)
                
                setTimer(resumedTime);
                setIsTimerRunning(true); // Start the timer
            } catch (error) {
                console.error('Error fetching progress:', error);
            }
        };

        if (id) {
            fetchProgress();
        }
    }, [id,totalProgress]);



   

    


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
     
        //  const name="introduction to css";
        
        const response=await axios.get(`${BACKEND_URL}/gettopicwise/get/topicwise/${title}`);

        
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
        
        var total=totalProgress
        return(Math.min((timer / (total*60)) * 100, 100).toFixed(2)); // Return percentage formatted to 2 decimal places
    };


    
    const handleExit = () => {
        setIsExitModalOpen(true); // Show exit confirmation modal
        setTimerper(calculatePercentage(timer))


    };


    const confirmExit = async() => {
                      

        const tokenauth = localStorage.getItem('authToken');
        setTimerper(calculatePercentage(timer))



        try {
            // Prepare the data to send to the API
            const data = {
                id: id, // The id from location.state
                progress: timerper, // Timer percentage
            };
   
            // Make an API call to update the progress
             await axios.post(`${BACKEND_URL}/progressUp/update-progress`,  data, { headers: {
                Authorization: `Bearer ${tokenauth}`, 
              },withCredentials: true });
    
           
        } catch (error) {
            console.error('An error occurred while updating progress:', error);
        }
    
    


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
                    <a href="#" onClick={handleCourseClick}>{course}</a>
                </header>
                <ul className="nav">
      {indexes.map((topic, index1) => (
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