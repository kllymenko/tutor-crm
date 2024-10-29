import React, {useState, useEffect} from "react";
import Navbar from "./navbar/Navbar";
import api from "../hooks/api";

const STUDENTS_URL = '/api/students';

export default function AddStudent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [StudentDto, setStudentDto] = useState({
        name: "",
        surname: "",
        phone: "",
        pricePerLesson: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setStudentDto({...StudentDto, [name]: value});
    };


    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await api.post(STUDENTS_URL, JSON.stringify(StudentDto), {
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
            });

            setIsLoading(false);
            if (!response.ok) {
                throw new Error("Не вдалося зберегти студента");
            }

            const data = await response.data; // Use response.data for axios
            setSuccessMessage("Студента успішно додано!");
            setStudentDto({
                name: "",
                surname: "",
                phone: "",
                pricePerLesson: ""
            });
        } catch (error) {
            setIsLoading(false);
            setError("Помилка при збереженні студента: " + error.message);
        }
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <div className={`table-container ${isSidebarOpen ? "shrinked" : ""}`}>
                <form onSubmit={handleSubmit}>
                    <h2>Додати учня</h2>

                    {error && <p style={{color: "red"}}>{error}</p>}
                    {successMessage && <p style={{color: "green"}}>{successMessage}</p>}

                    <div>
                        <label>Ім'я:</label>
                        <input
                            type="text"
                            name="name"
                            value={StudentDto.name}
                            onChange={handleChange}
                            placeholder="Введіть ім'я"
                            required
                            maxLength={64}
                        />
                    </div>

                    <div>
                        <label>Прізвище:</label>
                        <input
                            type="text"
                            name="surname"
                            value={StudentDto.surname}
                            onChange={handleChange}
                            placeholder="Введіть прізвище"
                            maxLength={64}
                        />
                    </div>

                    <div>
                        <label>Телефон:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={StudentDto.phone}
                            onChange={handleChange}
                            placeholder="Введіть телефон"
                            required
                            maxLength={20}
                        />
                    </div>

                    <div>
                        <label>Ціна за урок:</label>
                        <input
                            type="number"
                            name="pricePerLesson"
                            value={StudentDto.pricePerLesson}
                            onChange={handleChange}
                            placeholder="Введіть ціну за урок"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Збереження..." : "Зберегти"}
                    </button>
                </form>
            </div>
        </div>
    );
}