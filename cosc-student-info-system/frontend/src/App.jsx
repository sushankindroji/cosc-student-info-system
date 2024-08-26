import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Data from "./pages/Student/Data";
import Edit from "./pages/Student/Edit";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/student/data" element={<Data />} />
                <Route path="/student/edit/:id" element={<Edit />} />
                <Route path="/student/edit" element={<Edit />} />
                <Route path="/reports" element={<Reports />} />
            </Routes>
        </Router>
    );
}

export default App;