import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/note/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
    const [alert, setAlert] = useState(null);
    const adjustAlert = (message, type) => {
        setAlert({
            message: message,
            type: type,
        });
        setTimeout(() => {
            setAlert(null);
        }, 2000);
    };

    return (
        <>
            <NoteState>
                <Router>
                    <Navbar />
                    <Alert alert={alert} />

                    <div className="container mt-3">
                        {/* react-router-dom v6 */}
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={<Home adjustAlert={adjustAlert} />}
                            />
                            <Route exact path="/about" element={<About />} />
                            <Route
                                exact
                                path="/login"
                                element={<Login adjustAlert={adjustAlert} />}
                            />
                            <Route
                                exact
                                path="/signup"
                                element={<SignUp adjustAlert={adjustAlert} />}
                            />
                        </Routes>
                    </div>
                </Router>
            </NoteState>
        </>
    );
}

export default App;
