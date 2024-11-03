import { useState } from "react"
import axios from 'axios';
import './SignupPage.css'
const SignUpPage = () => {
   const [formdata, setFormdata]=useState({
    username:"",
    email:"",
    password:""
   })

   const [success,setSuccess]=useState('')
   const [errors, setErrors] = useState({});


   const handleChange=(e)=>{
       setFormdata({
        ...formdata,
        [e.target.name]:e.target.value
       })
   }


   const validateForm = () => {
    const newErrors = {};
    if (!formdata.username) newErrors.username = "Username is required";
    if (!formdata.email) newErrors.email = "Email is required";
    if (!formdata.password || formdata.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



   const handleSubmit=async (e)=>{
    e.preventDefault();
     if(!validateForm()) return;
    try {
        const response = await axios.post('http://localhost:9000/signup/user', formdata);
        setSuccess(response.data.msg); // Display success message
        setFormdata({ username: '', email: '', password: '' }); // Reset form
        setErrors({});
      } catch (error) {
        setErrors({ api: error.response?.data.msg || "Signup failed" });
      }

   }

  return (
    <div  className="signup-container">
        <form action="" onSubmit={handleSubmit}  className="signup-form">
    <h2>Create an acccount</h2>  
        {success && <p className="success-message">{success}</p>}
        {errors.api && <p className="error-message">{errors.api}</p>}

            <label htmlFor="">UserName
                <input type="text"

                name="username"
                value={formdata.username}
                onChange={handleChange}
                placeholder="Enter user name"
                />
                  {errors.username && <span className="error-text">{errors.username}</span>}
            </label>
          

            <label htmlFor="">Email
                <input type="email" 
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  placeholder="Enter Email here"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
            </label>
            
            <label htmlFor="">Password
                <input type="password"

                name="password"
                value={formdata.password}
                onChange={handleChange}
                placeholder="Enter the Password"  
                />
                 {errors.password && <span className="error-text">{errors.password}</span>}
            </label>
            
            <button type="submit" className="signup-button">Sign Up</button>
        </form>
    </div>
  )
}

export default SignUpPage