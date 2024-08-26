import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Data.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const Data = () => {
    const [students, setStudents] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/students/`);
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleEdit = (student) => {
        navigate(`/student/edit/${student.id}`, { state: { student } });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedStudents = React.useMemo(() => {
        let sortableStudents = [...students];
        if (sortConfig.key !== null) {
            sortableStudents.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableStudents;
    }, [students, sortConfig]);

    const filteredStudents = sortedStudents.filter(student => 
        Object.values(student).some(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );


    return (
        <div className="page-bg">
            <div className="data-page">
                <h1>Student Data</h1>
                <input 
                    type="text" 
                    placeholder="Search Students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <div className="data-content">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')}>Name</th>
                                <th onClick={() => handleSort('roll_number')}>Roll Number</th>
                                <th onClick={() => handleSort('age')}>Age</th>
                                <th onClick={() => handleSort('department')}>Department</th>
                                <th onClick={() => handleSort('semester')}>Semester</th>
                                <th onClick={() => handleSort('class_name')}>Class</th>
                                <th onClick={() => handleSort('cgpa')}>CGPA</th>
                                <th onClick={() => handleSort('attendance')}>Attendance</th>
                                <th onClick={() => handleSort('fee_paid')}>Fee Paid</th>
                                <th onClick={() => handleSort('fee_unpaid')}>Fee Unpaid</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.roll_number}</td>
                                    <td>{student.age}</td>
                                    <td>{student.department}</td>
                                    <td>{student.semester}</td>
                                    <td>{student.class_name}</td>
                                    <td>{student.cgpa}</td>
                                    <td>{student.attendance}</td>
                                    <td>{student.fee_paid}</td>
                                    <td>{student.fee_unpaid}</td>
                                    <td>
                                        <button onClick={() => handleEdit(student)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDelete(student.id)} className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Data;