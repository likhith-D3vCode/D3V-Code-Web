import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../CourseCard.css'; // Link to CSS for styling
import HTMLCourseImage from '../images/HTMLCourse.webp'; // Import the image

function CourseCard() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [progressValue, setProgressValue] = useState(50); // State to track progress (set to 50% initially)
  const imgRef = useRef(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    imgElement.addEventListener('load', () => setIsLoaded(true));

    return () => {
      imgElement.removeEventListener('load', () => setIsLoaded(true));
    };
  }, []);

  return (
    <div className="card imgcard" style={{ width: "18rem", height: "350px" }}>
      
      {/* Clickable Image and Play Button */}
      <div
        className="card-img-top clickable-image"
        onClick={() => navigate("/CourseIndex")}
        style={{
          backgroundImage: `url(${HTMLCourseImage})`,
          filter: isLoaded ? 'none' : 'blur(3px)',
          transition: 'filter 1s',
          cursor: 'pointer'
        }}
      >
        <img
          src={HTMLCourseImage}
          alt="HTML Course"
          ref={imgRef}
          style={{ opacity: 0, width: '100%' }}
        />
        
        {/* Play Button centered in the middle of the image */}
        <div className="play-button-wrapper">
          <i className="bi bi-caret-right-fill play-button"></i>
        </div>
      </div>

      <div className="card-body">
        <h5 className="course-title">Learn HTML</h5> 
        
        {/* Progress Bar and Percentage Display */}
        <div className="progress-container">
          <div className="progress-percentage left">{progressValue}%</div>
          <div className="progress-bar-wrapper">
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressValue}%` }}
                aria-valuenow={progressValue}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          <div className="progress-percentage right">100%</div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
