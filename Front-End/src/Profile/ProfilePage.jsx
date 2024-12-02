import { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";
import PropTypes from "prop-types";
import Calendar from "react-calendar";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [error, setError] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingSolved, setIsLoadingSolved] = useState(true);
  const [dateMarked, setDateMarked] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    profileImg: null,
  });

  // const [email, setEmail] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [message, setMessage] = useState("");

  // const handleResetPassword = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:9000/changePassword/forgotPassword",
  //       {
  //         email,
  //         newPassword,
  //       },
  //       { withCredentials: true }
  //     );
  //     setMessage(response.data.msg);
  //   } catch (error) {
  //     console.error("Error resetting password:", error);
  //     setMessage("Failed to reset password. Please try again.");
  //   }
  // };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/getallusers/userdata/api", {
          withCredentials: true,
        });
        const user = response.data?.userdata?.[0];
        if (user) {
          setUserData(user);
        } else {
          setError("No user data found.");
        }
      } catch (err) {
        setError("Failed to fetch user data: " + err.message);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:9000/allcourses/getAllcourses", {
          withCredentials: true,
        });
        setCourses(response.data?.courses || []);
      } catch (err) {
        setError((prev) => prev + "Failed to fetch courses: " + err.message);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch solved questions
  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/profilesolvedqn/users/solved-questions",
          {
            withCredentials: true,
          }
        );
        const fetchedSolvedQuestions = response.data?.solvedQuestions || [];
        setSolvedQuestions(fetchedSolvedQuestions);

        const solvedDates = fetchedSolvedQuestions.map((solved) =>
          new Date(solved.solvedAt).toLocaleDateString()
        );
        setDateMarked(solvedDates);
      } catch (err) {
        setError((prev) => prev + "Failed to fetch solved questions: " + err.message);
      } finally {
        setIsLoadingSolved(false);
      }
    };

    fetchSolvedQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditForm((prev) => ({ ...prev, profileImg: e.target.files[0] }));
  };

  const openEditForm = () => {
    if (userData) {
      setEditForm({
        username: userData.username,
        email: userData.email,
        profileImg: null,
      });
      setEditMode(true);
    }
  };

  const closeEditForm = () => {
    setEditMode(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", editForm.username);
    formData.append("email", editForm.email);
    if (editForm.profileImg) {
      formData.append("image", editForm.profileImg);
    }

    try {
      const response = await axios.put(
        "http://localhost:9000/putuserdata/updateUser",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUserData(response.data.updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user profile.");
    }
  };

  if (isLoadingUser || isLoadingCourses || isLoadingSolved) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* <div>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleResetPassword}>Reset Password</button>
        <p>{message}</p>
      </div> */}

      {userData && <UserProfile user={userData} onEdit={openEditForm} />}

      {editMode && (
        <div className="edit-modal">
          <form onSubmit={handleFormSubmit} className="edit-form">
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Profile Image:
              <input type="file" name="profileImg" onChange={handleFileChange} />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={closeEditForm}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <div className="courses-container">
        <h1>Courses</h1>
        {courses.length > 0 ? (
          <div className="courses-list">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <p>No courses available.</p>
        )}
      </div>

      <div className="solved-questions-container">
        <h2>My Solved Questions</h2>
        {solvedQuestions.length > 0 ? (
          <div className="solved-questions-list">
            {solvedQuestions.map((solved) => (
              <SolvedQuestionCard key={solved._id} solved={solved} />
            ))}
          </div>
        ) : (
          <p>No solved questions available.</p>
        )}
      </div>

      <div className="calendar-container">
        <h2>Your Progress</h2>
        <Calendar
          tileClassName={({ date }) =>
            dateMarked.includes(date.toLocaleDateString()) ? "highlighted-date" : ""
          }
        />
      </div>
    </div>
  );
};



// Component Definitions

const UserProfile = ({ user, onEdit }) => {
  const imageUrl = `/UserImages/${user.profileImg}`;
  return (
    <div className="profile-card">
      <img
        className="profile-image"
        src={imageUrl}
        alt={`${user.username}'s Profile`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/100?text=User";
        }}
      />
      <div className="user-info">
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <span className="role-tag">{user.role}</span>
        <button onClick={onEdit}>Edit Profile</button>
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => (
  <div className="course-card">
    <h2 className="course-title">{course.title}</h2>
    <p className="course-progress">Progress: {course.progress}%</p>
  </div>
);

const SolvedQuestionCard = ({ solved }) => (
  <div className="solved-question-card">
    {solved.Question ? (
      <>
        <h3 className="question-title">{solved.Question.title}</h3>
        <p className="question-description">{solved.Question.description}</p>
      </>
    ) : (
      <p className="no-question">Question not available</p>
    )}
    <span className="solved-at">
      Solved At: {new Date(solved.solvedAt).toLocaleString()}
    </span>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>{message}</p>
  </div>
);

// Prop validation
UserProfile.propTypes = {
  user: PropTypes.shape({
    profileImg: PropTypes.string,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired, // Ensure 'onEdit' is validated as a function

};

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
  }).isRequired,
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

SolvedQuestionCard.propTypes = {
  solved: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Question: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    solvedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfilePage;
