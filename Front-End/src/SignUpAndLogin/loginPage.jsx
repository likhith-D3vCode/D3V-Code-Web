import { useState } from "react";
import axios from "axios";
import "./LoginPage.css"; // Add this CSS file for styling
import { useNavigate } from "react-router-dom";
import BACKEND_URL from '../config';
import RedimadeNavBar from '../HomePage/RedimadeNavBar';
import {
   
    FaInstagram,
    FaTwitter,
    FaYoutube,
  } from "react-icons/fa"; // Added social media icons
const LoginPage = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {


        e.preventDefault();
        setError("");
        setLoading(true); 

        try {
            
            // Replace with the correct URL of your backend, which includes the load balancer URL if needed
            const response = await axios.post(`${BACKEND_URL}/login/api`, form, { 
               
                withCredentials: true // Ensure the cookie is sent and received with the request
            });
            console.log("Login success", response.data.token);
            const  tokenauth  = await response.data.token;
            console.log(tokenauth)
            localStorage.setItem('authToken', tokenauth);
            // Navigate to home or dashboard page after successful login
             navigate("/"); // Adjust the redirect path as needed
        } catch (err) {
            setError("Login failed. Please check your email and password.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <RedimadeNavBar />

        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
               <hr></hr>
               <button className="signupInLogin" onClick={() => navigate("/signUp")}>Create a new Account</button>
            </form>
        </div>
         {/* Footer Section */}
              <footer className="bg-dark text-white text-center p-4 mt-4">
                <div className="container">
                  <h5 className="mb-3">About Us</h5>
                  <p className="mb-4">
                    We are dedicated to providing the best web development resources and
                    tutorials.
                  </p>
                  <div className="social-icons mb-3">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <FaInstagram size={30} />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <FaTwitter size={30} />
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                    >
                      <FaYoutube size={30} />
                    </a>
                  </div>
                  <p className="mb-0">© 2024 D3vCode. All Rights Reserved.</p>
                  <p>
                    <a href="/privacy-policy" className="text-white">
                      Privacy Policy
                    </a>{" "}
                    |
                    <a href="/terms-of-service" className="text-white">
                      {" "}
                      Terms of Service
                    </a>
                  </p>
                </div>
              </footer>
        
        </>
    );
};

export default LoginPage;
