import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../CourseCard.css"; // Link to CSS for styling
import PropTypes from "prop-types";
// import HTMLCourseImage from '../AdminPage/CourseImages/1732130508338-pexels-padrinan-1591061.jpg'; // Import the image
import axios from "axios";
import RedimadeNavBar from "../HomePage/RedimadeNavBar";
import "./Course1.css";

const CourseCard = () => {
  const navigate = useNavigate();
  const [course, setcourse] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPage = 3;
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/allcourses/getAllcourses",
          {
            withCredentials: true,
          }
        );
        setCourses(response.data?.courses || []);
      } catch (err) {
        setError((prev) => prev + "Failed to fetch courses: " + err.message);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const paginatedCourse = course.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedCourses = courses.slice(
    (currentPages - 1) * itemsPerPage,
    currentPages * itemsPerPage
  );

  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/get-course/courses",
          { withCredentials: true }
        );

        setcourse(response.data);
      } catch (err) {
        console.log("error in frnt-en", err);
      }
    };

    getCourse();
  }, []);

  return (
    <>
      <RedimadeNavBar />
      <div className="recent">
        <p className="recent-h1">Welcome to </p>
        <p className="recent-h2">D3v Code Study</p>
      </div>

      <div className="courses-previous">
        <p className="course-previousText">
          Continue Your Previous Viewed Courses
          <i className="bi bi-arrow-right-circle-fill"></i>
        </p>
        {paginatedCourse.length > 0 ? (
          <div className="courses-previouslist">
            {paginatedCourse.map((course) => (
              <CardItem key={course._id} card={course} navigate={navigate} />
            ))}
          </div>
        ) : (
          <p>No courses available.</p>
        )}

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          {[...Array(Math.ceil(courses.length / itemsPerPage))].map(
            (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            disabled={currentPage === Math.ceil(courses.length / itemsPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="courses-container mt-4">
      <div className="AllCoursesText">
            <p>Front-End</p>
          </div>
        <div className="courses-All">
          
          {paginatedCourses.map((course) => (
            <div className="courses-All-items" key={course._id}>
              <CardItem card={course} navigate={navigate} />
            </div>
          ))}

                  </div>
                  <div className="pagination">
            <button
              disabled={currentPages === 1}
              onClick={() => setCurrentPages((prev) => prev - 1)}
            >
              Previous
            </button>
            {[...Array(Math.ceil(courses.length / itemsPerPage))].map(
              (_, index) => (
                <button
                  key={index}
                  className={currentPages === index + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPages(index + 1)}
                >
                  {index + 1}
                </button>
              )
            )}
            <button
              disabled={
                currentPages === Math.ceil(courses.length / itemsPerPage)
              }
              onClick={() => setCurrentPages((prev) => prev + 1)}
            >
              Next
            </button>
          </div>

        
      </div>
    </>
  );
};

const CardItem = ({ card, navigate }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const imgRef = useRef(null);

  const imageUrl = `/CourseImages/${card.image}`;

  useEffect(() => {
    const imgElement = imgRef.current;
    imgElement.addEventListener("load", () => setIsLoaded(true));

    return () => {
      imgElement.removeEventListener("load", () => setIsLoaded(true));
    };
  }, []);

  const handleNavigation = () => {
    navigate(`/CourseIndex/${card._id}`); // Pass data via state
  };

  return (
    <div className="card imgcard" style={{ width: "18rem", height: "350px" }}>
      <div
        className="card-img-top clickable-image"
        onClick={handleNavigation}
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: isLoaded ? "none" : "blur(3px)",
          transition: "filter 1s",
          cursor: "pointer",
        }}
      >
        <img
          src={imageUrl}
          alt={card.title}
          ref={imgRef}
          style={{ opacity: 0, width: "100%" }}
        />
        <div className="play-button-wrapper">
          <i className="bi bi-caret-right-fill play-button"></i>
        </div>
      </div>
      <div className="card-body">
        <h5 className="course-title">{card.title}</h5>
        <div className="progress-container">
          <div className="progress-percentage left">{card.progress}%</div>
          <div className="progress-bar-wrapper">
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${card.progress}%` }}
                aria-valuenow={card.progress}
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
};

// const CourseCardd = ({ course }) => (
//   <div className="course-card">
//     <h2 className="course-title">{course.title}</h2>
//     <p className="course-progress">Progress: {course.progress}%</p>
//   </div>
// );

CardItem.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    link: PropTypes.string.isRequired,
    indexes: PropTypes.array.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};

export default CourseCard;
