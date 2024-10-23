import React from "react";
import "./index.css";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

// PAGES
import Navbar from "./components/navbar/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Reports from "./components/Reports";
import Login from "./components/Login";
import Registration from "./components/Registration";

export default function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/registration" element={<Registration/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/products"  element={<Products/>} />
                    <Route path="/reports"  element={<Reports/>} />
                </Routes>
            </Router>
        </div>
    );
}
