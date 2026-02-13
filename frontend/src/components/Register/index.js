import "./index.css";
import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios";

function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
        };

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/register/",
                data
            );

            alert("Registration successful!");

            console.log("Server Response:", res.data);
            navigate("/login")

            // clear form after success
            setUsername("");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");

        } catch (err) {
            if (err.response) {
                console.log("Error Response:", err.response.data);
                alert(
                    "Registration failed:\n" +
                    JSON.stringify(err.response.data, null, 2)
                );
            } else if (err.request) {
                alert("No response from server. Check backend or network!");
            } else {
                alert("Error: " + err.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} autoComplete="off" className = "form-container">
            <h2>Register</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                autoComplete="new-username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
