import React, { useState, useEffect } from 'react';
import "../Html.css";

const HtmlCourse = () => {
    const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/UB1O30fR-EE');
    const [activeTopic, setActiveTopic] = useState('');
    const [showVideo, setShowVideo] = useState(false);
    const [labLink, setLabLink] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open
    const [showBlogs, setShowBlogs] = useState(true); // State to toggle between video and blog cards

    const playVideo = (url, topicId, labUrl) => {
        setVideoUrl(url);
        setActiveTopic(topicId);
        setLabLink(labUrl);
        setShowVideo(true); // Show video when a topic is clicked
        setShowBlogs(false); // Hide blog cards when video is shown
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

    const goToLab = () => {
        if (labLink) {
            window.location.href = labLink;
        }
    };

    const handleCourseClick = () => {
        setShowBlogs(true); // Show blog cards when "HTML Course" is clicked
        setShowVideo(false); // Hide video section
    };

    return (
        <div id="viewport">
            {/* Sidebar Section */}
            <div id="sidebar">
                <header>
                    <a href="#" onClick={handleCourseClick}>HTML Course</a>
                </header>
                <ul className="nav">
                    {/* Topic 1 */}
                    <li onMouseLeave={handleMouseLeave}>
                        <div className="topic-name" onClick={() => playVideo('https://www.youtube.com/embed/ZUx1t5Tf2hA', 'topic1', 'https://example.com/lab1')}>
                            <i className="zmdi zmdi-view-dashboard"></i> Introduction to HTML
                        </div>
                        <div className="dropdown-toggle" onClick={(e) => { e.stopPropagation(); toggleDropdown('topic1'); }}>
                            <span className={`arrow ${dropdownOpen === 'topic1' ? 'open' : ''}`}></span>
                        </div>
                        {dropdownOpen === 'topic1' && (
                            <ul className="dropdown-menu">
                                <li onClick={() => playVideo('https://www.youtube.com/embed/ZUx1t5Tf2hA', 'topic1', 'https://example.com/lab1')}>Start Learning</li>
                                <li onClick={goToLab}>Go to Lab</li> {/* Same functionality as the button */}
                            </ul>
                        )}
                    </li>

                    {/* Other Topics */}
                    {/* Add similar structure for other topics */}
                </ul>
            </div>

            {/* Content Section */}
            <div id="content">
                <div className="video-section">
                    {/* Conditionally render the video or blog cards */}
                    {showVideo ? (
                        <>
                            <iframe id="topicVideo" src={videoUrl} allowFullScreen></iframe>
                            {/* No "Go to Lab" button below the video anymore */}
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
        </div>
    );
};

export default HtmlCourse;
