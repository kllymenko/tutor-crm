import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./navbar/Navbar";
import api from "../hooks/api";

const LESSONS_URL = '/api/lessons';
const SUBJECTS_URL = '/api/subjects';

export default function AddLesson() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]); // Список предметів
    const [newSubject, setNewSubject] = useState(""); // Новий предмет
    const [isAddingSubject, setIsAddingSubject] = useState(false); // Стан додавання предмету
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        student_id: null,
        subject: null, // Зроблено вибором з існуючих
        timeStart: new Date(),
        timeEnd: new Date(),
        status: "",
        summary: ""
    });

    useEffect(() => {
        api.get(LESSONS_URL)
            .then((res) => {
                setStudents(res.data.map(student => ({ value: student.id, label: student.name })));
            })
            .catch((error) => console.error("Error fetching students:", error));

        // Завантаження предметів
        api.get(SUBJECTS_URL)
            .then((res) => {
                setSubjects(res.data.map(subject => ({ value: subject.id, label: subject.name })));
            })
            .catch((error) => console.error("Error fetching subjects:", error));
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStudentChange = (selectedOption) => {
        setFormData({ ...formData, student_id: selectedOption.value });
    };

    const handleSubjectChange = (selectedOption) => {
        setFormData({ ...formData, subject: selectedOption.value });
    };

    const handleStartDateChange = (date) => {
        setFormData({ ...formData, timeStart: date });
    };

    const handleEndDateChange = (date) => {
        setFormData({ ...formData, timeEnd: date });
    };

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    const handleAddNewSubject = () => {
        if (newSubject.trim()) {
            const newSubjectOption = { value: newSubject, label: newSubject };
            setSubjects((prevSubjects) => [...prevSubjects, newSubjectOption]);
            setFormData({ ...formData, subject: newSubject });
            setNewSubject("");
            setIsAddingSubject(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await api.post(LESSONS_URL, JSON.stringify(formData), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsLoading(false);
            if (response.status !== 200) {
                throw new Error("Не вдалося зберегти заняття");
            }

            const data = await response.data; // Use response.data for axios
            setSuccessMessage("Заняття успішно додано!");
        } catch (error) {
            setIsLoading(false);
            setError("Помилка при збереженні заняття: " + error.message);
        }
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <div className={`table-container ${isSidebarOpen ? "shrinked" : ""}`}>
                <form onSubmit={handleSubmit}>
                    <h2>Додати заняття</h2>

                    <div>
                        <label>Студент:</label>
                        <Select
                            options={students}
                            onChange={handleStudentChange}
                            placeholder="Виберіть студента"
                        />
                    </div>

                    <div>
                        <label>Предмет:</label>
                        <Select
                            options={subjects}
                            onChange={handleSubjectChange}
                            value={subjects.find(subject => subject.value === formData.subject)}
                            placeholder="Виберіть предмет"
                        />
                        {isAddingSubject ? (
                            <>
                                <input
                                    type="text"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    placeholder="Назва нового предмету"
                                />
                                <button type="button" onClick={handleAddNewSubject}>Додати</button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setIsAddingSubject(true)}>Додати новий предмет</button>
                        )}
                    </div>

                    <div>
                        <label>Початок заняття:</label>
                        <DatePicker
                            selected={formData.timeStart}
                            onChange={handleStartDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            placeholderText="Виберіть дату і час"
                            showMonthYearDropdown
                        />
                    </div>

                    <div>
                        <label>Кінець заняття:</label>
                        <DatePicker
                            selected={formData.timeEnd}
                            onChange={handleEndDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            placeholderText="Виберіть дату і час"
                            showMonthYearDropdown
                        />
                    </div>

                    <div>
                        <label>Статус:</label>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            placeholder="Введіть статус"
                        />
                    </div>

                    <div>
                        <label>Опис:</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            placeholder="Введіть опис заняття"
                        />
                    </div>

                    <button type="submit">Зберегти</button>
                </form>
            </div>
        </div>
    );
}
