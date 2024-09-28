import React from "react";
import "./styles.css";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

// PAGES
import Navbar from "./components/navbar/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Reports from "./components/Reports";

export default function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/products"  element={<Products/>} />
                    <Route path="/reports"  element={<Reports/>} />
                </Routes>
            </Router>
        </div>
    );
}
