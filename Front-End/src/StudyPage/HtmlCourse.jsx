import React from 'react';
import "../Html.css"

const HtmlCourse = () => {
    const [videoUrl, setVideoUrl] = React.useState('https://www.youtube.com/embed/UB1O30fR-EE');
    const [activeTopic, setActiveTopic] = React.useState('');

    const playVideo = (videoUrl, topicId) => {
        setVideoUrl(videoUrl);
        setActiveTopic(topicId);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Menu section */}
            <div className="menu">
                <h2>HTML Topics</h2>
                <ul>
                    <li
                        onClick={() => playVideo('https://www.youtube.com/embed/ZUx1t5Tf2hA', 'topic1')}
                        className={activeTopic === 'topic1' ? 'active' : ''}
                    >
                        <i id="icon-topic1" className="fas fa-clock"></i> Introduction to HTML
                    </li>
                    <li
                        onClick={() => playVideo('https://www.youtube.com/embed/pQN-pnXPaVg', 'topic2')}
                        className={activeTopic === 'topic2' ? 'active' : ''}
                    >
                        <i id="icon-topic2" className="fas fa-clock"></i> HTML Tags
                    </li>
                    <li
                        onClick={() => playVideo('https://www.youtube.com/embed/EnsI2x2FSwA', 'topic3')}
                        className={activeTopic === 'topic3' ? 'active' : ''}
                    >
                        <i id="icon-topic3" className="fas fa-clock"></i> Forms in HTML
                    </li>
                    <li
                        onClick={() => playVideo('https://www.youtube.com/embed/ykVgCBqU2V0', 'topic4')}
                        className={activeTopic === 'topic4' ? 'active' : ''}
                    >
                        <i id="icon-topic4" className="fas fa-clock"></i> HTML Tables
                    </li>
                </ul>
            </div>

            {/* Video display section */}
            <div className="video-section">
                <iframe id="topicVideo" src={videoUrl} allowFullScreen></iframe>

                {/* Lab Button */}
                <button
                    id="labButton"
                    className="lab-button"
                    onClick={() => window.location.href = 'https://lab-link.example.com'} // Set your desired lab link here
                >
                    Go to Lab
                </button>
            </div>
        </div>
    );
};

export default HtmlCourse;
