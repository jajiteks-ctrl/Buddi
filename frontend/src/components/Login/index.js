import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/",
        { username, password }
      );

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      setMsg("Login successful");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setMsg("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleAuth}>
        <div>
          <label>Username</label><br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
        <p>{msg}</p>
      </form>
    </div>
  );
};

export default Login;
