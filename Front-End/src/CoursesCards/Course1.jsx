import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../CourseCard.css"; // Link to CSS for styling
import PropTypes from "prop-types";
import axios from "axios";
import RedimadeNavBar from "../HomePage/RedimadeNavBar";
import "./Course1.css";
import BACKEND_URL from "../config";

const CourseCard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]); // All courses
  const [Continuecourses, setContinueCourses] = useState([]); // Filtered courses with progress > 0
  const [currentPage, setCurrentPage] = useState(1);
  const [continuePage, setContinuePage] = useState(1);
  const itemsPerPage = 3;
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      const tokenauth = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `${BACKEND_URL}/allcourses/getAllcourses`,
          {
            headers: { Authorization: `Bearer ${tokenauth}` },
            withCredentials: true,
          }
        );

        const allCourses = response.data?.courses || [];
        setCourses(allCourses); // All courses
        setContinueCourses(allCourses.filter((course) => course.progress > 0)); // Filtered courses
      } catch (err) {
        setError("Failed to fetch courses: " + err.message);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Pagination logic for all courses
  const paginatedCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination logic for filtered courses
  const paginatedContinueCourses = Continuecourses.slice(
    (continuePage - 1) * itemsPerPage,
    continuePage * itemsPerPage
  );

  return (
    <>
      <RedimadeNavBar />
      <div className="recent">
        <p className="recent-h1">Welcome to </p>
        <p className="recent-h2">D3v Code Study</p>
      </div>

      {/* Continue Previous Courses */}
      <div className="courses-previous">
        <p className="course-previousText">
          Continue Your Previous Viewed Courses
          <i className="bi bi-arrow-right-circle-fill"></i>
        </p>
        {paginatedContinueCourses.length > 0 ? (
          <div className="courses-previouslist">
            {paginatedContinueCourses.map((course) => (
              <CardItem key={course._id} card={course} navigate={navigate} />
            ))}
          </div>
        ) : (
          <p>No courses available to continue.</p>
        )}

        {/* Pagination for Continue Courses */}
        <div className="pagination">
          <button
            disabled={continuePage === 1}
            onClick={() => setContinuePage((prev) => prev - 1)}
          >
            Previous
          </button>
          {[...Array(Math.ceil(Continuecourses.length / itemsPerPage))].map(
            (_, index) => (
              <button
                key={index}
                className={continuePage === index + 1 ? "active-page" : ""}
                onClick={() => setContinuePage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            disabled={
              continuePage === Math.ceil(Continuecourses.length / itemsPerPage)
            }
            onClick={() => setContinuePage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* All Courses */}
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

        {/* Pagination for All Courses */}
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
    </>
  );
};

// Reusable CardItem Component
const CardItem = ({ card, navigate }) => {
  const handleNavigation = () => {
    navigate(`/CourseIndex/${card._id}`);
  };

  return (
    <div className="card imgcard" style={{ width: "18rem", height: "380px" }}>
      <div
        className="card-img-top clickable-image"
        onClick={handleNavigation}
        style={{
          backgroundImage: `url(/CourseImages/${card.image})`,
          cursor: "pointer",
        }}
      > <div className="play-button-wrapper">
      <i className="bi bi-caret-right-fill play-button"></i>
    </div></div>
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

CardItem.propTypes = {
  card: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default CourseCard;
