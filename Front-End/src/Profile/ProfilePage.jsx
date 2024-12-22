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
  const [totalSolved, settotalSolved] = useState(null);
  const [accepted, setaccepted] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    profileImg: null,
    phoneNo: "",
    skills: [],
    education: [],
  });

  
  const [difficulties, setDifficulties] = useState({
    Beginner: 0,
    Intermediate: 0,
    Hard: 0,
  });
  const [skills, setSkills] = useState([""]); // State to hold skills
  const [education, setEducation] = useState([
    { schoolName: '', year: '', score: '', place: '' }
  ]);



  const handleEditClick = () => {
    setEditForm({
      username: userData.username || "",
      email: userData.email || "",
      phoneNo: userData.phoneNo || "",
      profileImg: userData.profileImg || "",
      skills: userData.skills || [],
      education: userData.education || [],
    });
    setEditMode(true);
  };


  
  const addSkill = () => {
    setSkills([...skills, ""]); // Add a new empty skill input
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index)); // Remove a specific skill
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills); // Update the value of a specific skill
    console.log(skills)
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };
  
  const addEducation = () => {
    setEducation([...education, { schoolName: '', year: '', score: '', place: '' }]);
  };
  
  const removeEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };


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
        setError((prev) => prev + "There are no Active courses" );
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
        setError("You are not yet solved any question");
      } finally {
        setIsLoadingSolved(false);
      }
    };

    fetchSolvedQuestions();
  }, []);


  useEffect(() => {
    const calculateStats = () => {
      // Create a copy of the difficulties object to avoid direct mutation
      const difficultyCounts = { Beginner: 0, Intermediate: 0, Hard: 0 };

      solvedQuestions.forEach((question) => {
        const level = question.Question.difficulty;
        if (difficultyCounts[level] !== undefined) {
          difficultyCounts[level] += 1;
        }
      });

      // Update state with the calculated difficulties
      setDifficulties(difficultyCounts);

      // Update total solved questions
      settotalSolved(solvedQuestions.length);

      // Calculate acceptance rate
      const acceptanceRate = ((solvedQuestions.length / 530) * 100).toFixed(2);
      setaccepted(acceptanceRate);
    };

    calculateStats();
  }, [solvedQuestions]);
  


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
        phoneNo: userData.phoneNo || "",
        skills: userData.skills || "",
        education: userData.education || "",
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
    formData.append("phoneNo", editForm.phoneNo);
    formData.append("skills", JSON.stringify(skills)); // Send as JSON string
  formData.append("education", JSON.stringify(education));
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

        <div className="percentage1">{accepted}%</div>
          <div className="text1">Acceptance</div>
          <div className="submissions1">{totalSolved} submissions</div>
          <div className="easy">
          <div className="label">Easy</div>
          <div className="count">{difficulties.Beginner}</div>
        </div>
        <div className="medium">
          <div className="label">Medium</div>
          <div className="count">{difficulties.Intermediate}</div>
        </div>
        <div className="hard">
          <div className="label">Hard</div>
          <div className="count">{difficulties.Hard}</div>
        </div>
          
      {userData && <UserProfile user={userData}onEdit={handleEditClick} />}
        
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
              PhoneNumber:
              <input
                type="number"
                name="phoneNo"
                value={editForm.phoneNo}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Profile Image:
              <input type="file" name="profileImg" onChange={handleFileChange} />
            </label>
            <div className="skills-container">
        <h2>Skills</h2>
        {skills.map((skill, index) => (
          <div key={index} className="skill-row">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              placeholder="Enter a skill"
            />
            {skills.length > 1 && (
              <button type="button" onClick={() => removeSkill(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addSkill}>
          Add More Skills
        </button>
      </div>

      {/* Education Section */}
      <div className="education-container">
  <h2>Education</h2>
  {education.map((edu, index) => (
    <div key={index} className="education-row">
      <input
        type="text"
        value={edu.schoolName}
        onChange={(e) => handleEducationChange(index, 'schoolName', e.target.value)}
        placeholder="School Name"
      />
      <input
        type="text"
        value={edu.year}
        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
        placeholder="Year"
      />
      <input
        type="text"
        value={edu.score}
        onChange={(e) => handleEducationChange(index, 'score', e.target.value)}
        placeholder="Score"
      />
      <input
        type="text"
        value={edu.place}
        onChange={(e) => handleEducationChange(index, 'place', e.target.value)}
        placeholder="Place"
      />
      {education.length > 1 && (
        <button type="button" onClick={() => removeEducation(index)}>
          Remove
        </button>
      )}
    </div>
  ))}
  <button type="button" onClick={addEducation}>
    Add More Education
  </button>
</div>



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
      <div className="user-info1">
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <span className="role-tag">{user.role}</span>
        <p><strong>Phone:</strong> {user.phoneNo || "N/A"}</p>
        <p>
          <strong>Skills:</strong>
          {user.skils && user.skils.length > 0 ? (
            <ul>
              {user.skils.map((skill, index) => (
                <li key={index}>{skill.addskills}</li>
              ))}
            </ul>
          ) : (
            "No skills listed"
          )}
        </p>
        <p>
          <strong>Education:</strong>
          {user.Education && user.Education.length > 0 ? (
            <ul>
              {user.Education.map((edu, index) => (
                <li key={index}>
                  {edu.schoolName} ({edu.year}) - {edu.score} - {edu.place}
                </li>
              ))}
            </ul>
          ) : (
            "No education details listed"
          )}
        </p>
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

// PropTypes validation
UserProfile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profileImg: PropTypes.string,
    phoneNo: PropTypes.number,
    skils: PropTypes.arrayOf(PropTypes.object),
    Education: PropTypes.arrayOf(
      PropTypes.shape({
        schoolName: PropTypes.string,
        year: PropTypes.string,
        score: PropTypes.string,
        place: PropTypes.string
      })
    )
  }).isRequired,
  onEdit: PropTypes.func.isRequired
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
  }).isRequired,
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

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};


export default ProfilePage;
