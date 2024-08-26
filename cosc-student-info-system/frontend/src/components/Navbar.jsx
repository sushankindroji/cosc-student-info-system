import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/COSC.png";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="navbar">
            <div className="logo-container">
                <img src={Logo} alt="COSC" />
                <h3>Student Information System</h3>
            </div>
            <nav>
                <ul className="nav">
                    <li>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li className="dropdown" ref={dropdownRef}>
                        <span
                            className={`nav-link ${isDropdownOpen ? 'active' : ''}`}
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                        >
                            Student 
                            <span className={`arrow ${isDropdownOpen ? 'rotate' : ''}`}>&#9662;</span>
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-content">
                                <Link to="/student/data" className="dropdown-item">
                                    Data
                                </Link>
                                <Link to="/student/edit" className="dropdown-item">
                                    Edit
                                </Link>
                            </div>
                        )}
                    </li>
                    <li>
                        <Link to="/reports" className="nav-link">
                            Reports
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;