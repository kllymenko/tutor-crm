import React, { useEffect, useState } from "react";
import Navbar from "./navbar/Navbar";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/students")
            .then((response) => response.json())
            .then((data) => setStudents(data))
            .catch((error) => console.error("Error fetching students:", error));
    }, []);

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className={`table-container ${isSidebarOpen ? "shrinked" : ""}`}>
                <h1>Учні</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tutor ID</th>
                        <th>Student ID</th>
                        <th>Subject</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Summary</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.student_id}</td>
                            <td>{student.student_id}</td>
                            <td>{student.subject}</td>
                            <td>{new Date(student.timeStart).toLocaleString()}</td>
                            <td>{new Date(student.timeEnd).toLocaleString()}</td>
                            <td className={
                                student.status === "Новий" ? "status-new" :
                                    student.status === "Обслуговується" ? "status-processed" :
                                        "status-pending"
                            }>
                                {student.status}
                            </td>
                            <td>{student.summary}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
