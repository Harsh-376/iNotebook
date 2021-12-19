import "../css/FormStyle.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useHistory() changed to useNavigate In react router v6

export default function Login(props) {
    const [credential, setCredential] = useState({ email: "", password: "" });
    let navigate = useNavigate();

    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credential.email,
                password: credential.password,
            }),
        });
        const json = await response.json();

        if (json.success) {
            // * Save the auth token and REDIRECT
            localStorage.setItem("token", json.authToken);
            props.adjustAlert("Logged in successfully", "success");
            navigate("/");
        } else {
            props.adjustAlert(json.error, "danger");
        }
    };
    return (
        <>
            <h3 className="text-center mb-3">Login in iNoteBook</h3>
            <form className="loginSignup" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </>
    );
}
