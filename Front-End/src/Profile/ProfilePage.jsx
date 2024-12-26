import { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";
import { FaPen, FaToolbox, FaGraduationCap, FaPhoneAlt, FaChevronRight } from "react-icons/fa"; 
import PropTypes from "prop-types";
import Calendar from "react-calendar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



ChartJS.register(ArcElement, Tooltip, Legend);


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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const highlightedDates = dateMarked.map((date) => new Date(date));
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    profileImg: null,
    phoneNo: "",
    skills: [],
    education: [],
  });

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };
  


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
  const [courseIndex, setCourseIndex] = useState(0);


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
  
  const pieChartData = {
    labels: ["Hard", "Medium", "Easy"],
    datasets: [
      {
        data: [difficulties.Hard, difficulties.Intermediate, difficulties.Beginner],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
  

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
    <div className="profile-and-stats">
      {/* Profile Details */}
      {userData && <UserProfile user={userData} onEdit={handleEditClick} />}
      
      {/* Stats Containers */}
      <div className="stats-side-container">
        <div className="stats-item">
          <h2>Acceptance Rate</h2>
          <CircularProgressbar
            value={accepted}
            text={`${accepted}%`}
            styles={buildStyles({
              textColor: "#333",
              pathColor: "#4CAF50",
              trailColor: "#d6d6d6",
              textSize: "12px",
              pathWidth: 6,
            })}
          />
          <p>Total Submissions: {totalSolved}</p>
        </div>
  
        <div className="stats-item">
          <h2>Difficulty Breakdown</h2>
          <Pie
            data={pieChartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  labels: {
                    font: { size: 10 },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  
   

      {editMode && (
 <div className="modal-overlay">
 <div className="modal-content">
   <button className="close-button" onClick={closeEditForm}>
     &times;
   </button>
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
       Phone Number:
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

     {/* Skills Section */}
     <div className="skills-container">
  <h2>Skills</h2>
  {skills.map((skill, index) => (
    <div key={index} className="skill-row">
      <input
        type="text"
        value={skill}
        onChange={(e) => handleSkillChange(index, e.target.value)}
        placeholder="Enter a skill"
        required
      />
    </div>
  ))}

  {/* + Icon */}
  <div
    className={`add-icon ${
      skills.some((skill) => skill.trim() === '') ? 'disabled' : ''
    }`}
    onClick={() => {
      if (!skills.some((skill) => skill.trim() === '')) {
        addSkill();
      }
    }}
  >
    +
  </div>
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
        required
      />
      <input
        type="text"
        value={edu.year}
        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
        placeholder="Year"
        required
      />
      <input
        type="text"
        value={edu.score}
        onChange={(e) => handleEducationChange(index, 'score', e.target.value)}
        placeholder="Score"
        required
      />
      <input
        type="text"
        value={edu.place}
        onChange={(e) => handleEducationChange(index, 'place', e.target.value)}
        placeholder="Place"
        required
      />
    </div>
  ))}

  {/* + Icon */}
  <div
    className={`add-icon ${
      education.some((edu) =>
        Object.values(edu).some((field) => field.trim() === '')
      )
        ? 'disabled'
        : ''
    }`}
    onClick={() => {
      if (
        !education.some((edu) =>
          Object.values(edu).some((field) => field.trim() === '')
        )
      ) {
        addEducation();
      }
    }}
  >
    +
  </div>
</div>

     {/* Buttons */}
     <div className="edit-form-buttons">
       <button type="submit">Save Changes</button>
       <button type="button" onClick={closeEditForm}>
         Cancel
       </button>
     </div>
   </form>
 </div>
</div>


)}
{error && <ErrorMessage message={error} />}








<div className="courses-container">
  <h2 className="container-title">Courses</h2>
  <div className="courses-grid">
    {courses.map((course) => (
      <div key={course._id} className="course-card">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-progress">Progress: {course.progress}%</p>
      </div>
    ))}
  </div>
</div>



      <div className="solved-questions-container">
  <div className="solved-questions-header">
    <h2>My Solved Problems</h2>
    <p className="total-solved-count">Total Solved: {solvedQuestions.length}</p>
  </div>
  {solvedQuestions.length > 0 ? (
    <table className="solved-questions-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Question Name</th>
          <th>Question Description</th>
          <th>Solved At</th>
        </tr>
      </thead>
      <tbody>
        {solvedQuestions.map((solved, index) => (
          <tr key={solved._id}>
            <td>{index + 1}</td>
            <td>{solved.Question ? solved.Question.title : "N/A"}</td>
            <td>{solved.Question ? solved.Question.description : "N/A"}</td>
            <td>{new Date(solved.solvedAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No solved questions available.</p>
  )}
</div>


      <div className="calendar-container">
      <h2 className="calendar-header">Your Progress</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
        highlightDates={highlightedDates}
        dayClassName={(date) =>
          highlightedDates.some(
            (highlightedDate) =>
              date.getDate() === highlightedDate.getDate() &&
              date.getMonth() === highlightedDate.getMonth() &&
              date.getFullYear() === highlightedDate.getFullYear()
          )
            ? "highlighted-date"
            : undefined
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
    {/* Profile Image */}
    <img
      className="profile-image"
      src={imageUrl}
      alt={`${user.username}'s Profile`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/100?text=User";
      }}
    />
  
    {/* User Info */}
    <div className="user-info">
      <h2 className="username">{user.username}</h2>
      <p className="email">{user.email}</p>
      <span className="role-tag">{user.role}</span>
      <div className="user-detail">
  <FaPhoneAlt /> <span>{user.phoneNo || "N/A"}</span>
</div>

    </div>
  
    {/* Skills Section */}
    <div className="skills-container">
      <h3><FaToolbox /> Skills</h3>
      {user.skils && user.skils.length > 0 ? (
        <ul>
          {user.skils.map((skill, index) => (
            <li key={index}>
              <FaChevronRight /> {skill.addskills}
            </li>
          ))}
        </ul>
      ) : (
        <p>No skills listed</p>
      )}
    </div>
  
    {/* Education Section */}
    <div className="education-container">
      <h3><FaGraduationCap /> Education</h3>
      {user.Education && user.Education.length > 0 ? (
        <ul>
          {user.Education.map((edu, index) => (
            <li key={index}>
              <FaChevronRight /> {edu.schoolName} ({edu.year}) - {edu.score} - {edu.place}
            </li>
          ))}
        </ul>
      ) : (
        <p>No education details listed</p>
      )}
    </div>
  
    {/* Edit Icon */}
    <div className="edit-icon-container">
      <FaPen
        onClick={onEdit}
        className="edit-icon"
        style={{ color: '#ff5733', cursor: 'pointer', fontSize: '24px' }}
      />
    </div>
  </div>
  
  );
};



const CourseCard = ({ course }) => (
  <div className="course-card">
    <div className="course-card-header">
      <h2 className="course-title">{course.title}</h2>
    </div>
    <div className="course-card-body">
      <p className="course-progress">Progress: {course.progress}%</p>
    </div>
  </div>
);

const SolvedQuestionCard = ({ solved }) => (
  <div className="solved-question-card">
    <div className="solved-question-header">
      {solved.Question ? (
        <h3 className="question-title">{solved.Question.title}</h3>
      ) : (
        <p className="no-question">Question not available</p>
      )}
    </div>
    <div className="solved-question-body">
      {solved.Question && (
        <p className="question-description">{solved.Question.description}</p>
      )}
      <span className="solved-at">
        Solved At: {new Date(solved.solvedAt).toLocaleString()}
      </span>
    </div>
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
