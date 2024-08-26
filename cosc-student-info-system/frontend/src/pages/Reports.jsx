import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const Reports = () => {
    const [students, setStudents] = useState([]);
    const [rollNumber, setRollNumber] = useState("");
    const [reportType, setReportType] = useState("all");
    const [studentReport, setStudentReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showReport, setShowReport] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/students/`);
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
            setError("Failed to fetch student data. Please try again later.");
        }
    };

    const generateReport = () => {
        setLoading(true);
        setError("");
        setShowReport(false);
        const student = students.find(s => s.roll_number === rollNumber);
        if (student) {
            setStudentReport(student);
            setShowReport(true);
        } else {
            setError("Student not found. Please check the roll number and try again.");
            setStudentReport(null);
        }
        setLoading(false);
    };

    const renderReport = () => {
        if (!studentReport) return null;

        const reports = {
            attendance: (
                <div className="report-item">
                    <h3>Attendance Report</h3>
                    <p className={`status ${studentReport.attendance >= 75 ? "good" : "bad"}`}>
                        {studentReport.attendance}%
                    </p>
                    <p className="description">
                        {studentReport.attendance >= 75
                            ? "Good attendance. Keep it up!"
                            : "Attendance needs improvement. Try to maintain above 75%."}
                    </p>
                </div>
            ),
            cgpa: (
                <div className="report-item">
                    <h3>CGPA Report</h3>
                    <p className={`status ${getCGPAClass(studentReport.cgpa)}`}>
                        {studentReport.cgpa}
                    </p>
                    <p className="description">{getCGPADescription(studentReport.cgpa)}</p>
                </div>
            ),
            fees: (
                <div className="report-item">
                    <h3>Fees Report</h3>
                    <p className={`status ${studentReport.fee_unpaid === 0 ? "good" : "bad"}`}>
                        {studentReport.fee_unpaid === 0 ? "Fully Paid" : `₹${studentReport.fee_unpaid} Unpaid`}
                    </p>
                    <p className="description">
                        {studentReport.fee_unpaid === 0
                            ? "All fees have been paid. Great job!"
                            : `You need to pay ₹${studentReport.fee_unpaid} to clear your dues.`}
                    </p>
                </div>
            )
        };

        return (
            <div className="report-card">
                <h2>{studentReport.name}'s Report</h2>
                {reportType === "all" ? (
                    <>
                        {reports.attendance}
                        {reports.cgpa}
                        {reports.fees}
                    </>
                ) : (
                    reports[reportType]
                )}
            </div>
        );
    };

    const getCGPAClass = (cgpa) => {
        if (cgpa >= 9) return "excellent";
        if (cgpa >= 8) return "very-good";
        if (cgpa >= 7) return "good";
        if (cgpa >= 6) return "average";
        return "bad";
    };

    const getCGPADescription = (cgpa) => {
        if (cgpa >= 9) return "Excellent performance! Keep up the outstanding work.";
        if (cgpa >= 8) return "Very good performance. You're doing great!";
        if (cgpa >= 7) return "Good performance. There's room for improvement.";
        if (cgpa >= 6) return "Average performance. Try to improve your grades.";
        return "Performance needs significant improvement. Seek guidance from your professors.";
    };

    return (
        <div className="page-bg">
            <div className="reports-container">
                <h1 className="heading">Student Reports</h1>
                <div className="input-group">
                    <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="Enter Roll Number"
                        className="input-field"
                    />
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input-field">
                        <option value="all">All Reports</option>
                        <option value="attendance">Attendance</option>
                        <option value="cgpa">CGPA</option>
                        <option value="fees">Fees</option>
                    </select>
                    <button onClick={generateReport} disabled={loading} className="primary-button">
                        {loading ? "Loading..." : "Get Report"}
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {showReport && renderReport()}
            </div>
        </div>
    );
};
    
export default Reports;
