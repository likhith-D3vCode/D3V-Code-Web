import { useState } from "react";
import axios from "axios";
import "./LoginPage.css"; // Add this CSS file for styling
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
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
            const response = await axios.post("http://localhost:9000/login/api", form, { withCredentials: true });
            console.log("Login success",response.data);
            
                     navigate("/");
           
        } catch (err) {
            setError("Login failed. Please check your email and password.",err);
        } finally {
            setLoading(false);
        }
    };

    return (
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
            </form>
        </div>
    );
};

export default LoginPage;
