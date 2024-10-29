import React from "react";
import "./index.css";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

// PAGES
import Navbar from "./components/navbar/Navbar";
import Lessons from "./components/Lessons";
import Students from "./components/Students";
import Login from "./components/Login";
import Registration from "./components/Registration";
import AddLesson from "./components/AddLesson";
import AddStudent from "./components/AddStudent";

export default function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/registration" element={<Registration/>} />
                    <Route path="/lessons" element={<Lessons/>} />
                    <Route path="/students"  element={<Students/>} />
                    <Route path="/add-lesson" element={<AddLesson/>} />
                    <Route path="/add-student" element={<AddStudent/>} />
                </Routes>
            </Router>
        </div>
    );
}
