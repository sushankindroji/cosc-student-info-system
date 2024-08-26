import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./Edit.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const Edit = () => {
    const [formData, setFormData] = useState({
        name: "",
        roll_number: "",
        age: "",
        department: "",
        semester: "",
        class_name: "",
        cgpa: "",
        attendance: "",
        fee_paid: ""
    });
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            if (location.state && location.state.student) {
                setFormData(location.state.student);
            } else {
                fetchStudent(id);
            }
        }
    }, [id, location]);

    const fetchStudent = async (studentId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching student:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`${API_BASE_URL}/students/${id}`, formData);
            } else {
                await axios.post(`${API_BASE_URL}/students/`, formData);
            }
            navigate('/'); // Redirect to the main data page after submission
        } catch (error) {
            console.error("Error saving student:", error);
        }
    };

    return (
        <div className="page-bg">
            <div className="edit-page">
                <h1>{id ? "Edit" : "Add"} Student Information</h1>
                <div className="edit-content">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="roll_number"
                                placeholder="Roll Number"
                                value={formData.roll_number}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                name="semester"
                                placeholder="Semester"
                                value={formData.semester}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="class_name"
                                placeholder="Class Name"
                                value={formData.class_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                name="cgpa"
                                placeholder="CGPA"
                                step="0.01"
                                value={formData.cgpa}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                name="attendance"
                                placeholder="Attendance"
                                step="0.01"
                                value={formData.attendance}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                name="fee_paid"
                                placeholder="Fee Paid"
                                step="0.01"
                                value={formData.fee_paid}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">
                            {id ? "Update" : "Add"} Student
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit;