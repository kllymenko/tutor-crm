import React, { useEffect, useState } from "react";
import Navbar from "./navbar/Navbar";

export default function Lessons() {
    const [lessons, setLessons] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/lessons")
            .then((response) => response.json())
            .then((data) => setLessons(data))
            .catch((error) => console.error("Error fetching lessons:", error));
    }, []);

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className={`table-container ${isSidebarOpen ? "shrinked" : ""}`}>
                <h1>Заняття</h1>
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
                    {lessons.map((lesson) => (
                        <tr key={lesson.id}>
                            <td>{lesson.id}</td>
                            <td>{lesson.tutor_id}</td>
                            <td>{lesson.student_id}</td>
                            <td>{lesson.subject}</td>
                            <td>{new Date(lesson.timeStart).toLocaleString()}</td>
                            <td>{new Date(lesson.timeEnd).toLocaleString()}</td>
                            <td className={
                                lesson.status === "Новий" ? "status-new" :
                                    lesson.status === "Обслуговується" ? "status-processed" :
                                        "status-pending"
                            }>
                                {lesson.status}
                            </td>
                            <td>{lesson.summary}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
