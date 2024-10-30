import React, {useEffect, useState} from "react";
import Navbar from "./navbar/Navbar";
import api from "../hooks/api";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        api.get('/api/students')
            .then(response => {
                console.log(response)
                setStudents(response.data);
            })
            .catch((error) => console.error("Error fetching students:", error));
    }, []);

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <div className={`table-container ${isSidebarOpen ? "shrinked" : ""}`}>
                <h1>Учні</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ім'я</th>
                        <th>Прізвище</th>
                        <th>Телефон</th>
                        <th>Баланс</th>
                        <th>Ціна уроку</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.student_id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.surname}</td>
                            <td>{student.phone}</td>
                            <td>{student.balance}</td>
                            <td>{student.pricePerLesson}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
