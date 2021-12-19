import "../css/FormStyle.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useHistory() changed to useNavigate In react router v6

export default function SignUp(props) {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    });
    const navigate = useNavigate();

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;
        if (password === cpassword) {
            const response = await fetch(
                "http://localhost:5000/api/auth/createuser",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password }),
                }
            );
            const json = await response.json();

            if (json.success) {
                localStorage.setItem("token", json.authToken);
                props.adjustAlert("Account created successfully", "success");
                navigate("/");
            } else {
                props.adjustAlert(json.error, "danger");
            }
        } else {
            props.adjustAlert("Password not matching!", "danger");
        }
    };
    return (
        <>
            <h3 className="text-center mb-3">SignUp at iNoteBook</h3>
            <form className="loginSignup" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        onChange={onChange}
                        minLength={3}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailmessage"
                        onChange={onChange}
                        required
                    />
                    <div id="emailmessage" className="form-text">
                        We'll never share your email with anyone else.
                    </div>
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
                        minLength={5}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="cpassword"
                        name="cpassword"
                        onChange={onChange}
                        minLength={5}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </>
    );
}
