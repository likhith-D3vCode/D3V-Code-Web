import  { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../CourseCard.css'; // Link to CSS for styling
import PropTypes from 'prop-types';
// import HTMLCourseImage from '../AdminPage/CourseImages/1732130508338-pexels-padrinan-1591061.jpg'; // Import the image
import axios from 'axios';


const CourseCard = () => {
  const navigate = useNavigate();
  const [course,setcourse]=useState([])
  
  
useEffect(()=>{
  const getCourse=async()=>{
   try{
    const response=await axios.get("http://localhost:9000/get-course/courses", { withCredentials: true });
    console.log(response)
    setcourse(response.data)

   }catch(err){
    console.log("error in frnt-en",err);
   }
  }

  getCourse();

},[])


  return (
    <div className="container mt-4">
      <div className="row gy-4">
      {course.map((course) => (
          <div className="col-md-4 col-sm-6" key={course._id}>
            <CardItem card={course} navigate={navigate}  />
          </div>
        ))}
      </div>
    </div>
  );
};

const CardItem = ({ card, navigate}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const imgRef = useRef(null);

  const imageUrl = `/CourseImages/${card.image}`;


  useEffect(() => {
    const imgElement = imgRef.current;
    imgElement.addEventListener('load', () => setIsLoaded(true));

    return () => {
      imgElement.removeEventListener('load', () => setIsLoaded(true));
    };
  }, []);

 
  const handleNavigation = () => {
    navigate("/CourseIndex", { state: { index: card.indexes, title: card.title,id:card._id } }); // Pass data via state
  };


  return (
    <div className="card imgcard" style={{ width: "18rem", height: "350px" }}>
      <div
        className="card-img-top clickable-image"
        onClick={handleNavigation}
        style={{
          backgroundImage: `url(${imageUrl})`,
          filter: isLoaded ? 'none' : 'blur(3px)',
          transition: 'filter 1s',
          cursor: 'pointer',
        }}
      >
        <img
          src={imageUrl}
          alt={card.title}
          ref={imgRef}
          style={{ opacity: 0, width: '100%' }}
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
            <div className="progress" style={{ height: '8px' }}>
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
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    link: PropTypes.string.isRequired,
    indexes:PropTypes.array.isRequired,
    _id:PropTypes.string.isRequired
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};

export default CourseCard;
