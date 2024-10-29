import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./navbar/Navbar";

export default function AddLesson({onSave}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tutors, setTutors] = useState([]);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        tutor_id: null,
        student_id: null,
        subject: "",
        timeStart: new Date(),
        timeEnd: new Date(),
        status: "",
        summary: ""
    });

    useEffect(() => {
        // Завантаження списків викладачів та студентів з бекенду
        fetch("http://localhost:8080/api/tutors")
            .then((res) => res.json())
            .then((data) => setTutors(data.map(tutor => ({value: tutor.id, label: tutor.name}))))
            .catch((error) => console.error("Error fetching tutors:", error));

        fetch("http://localhost:8080/api/students")
            .then((res) => res.json())
            .then((data) => setStudents(data.map(student => ({value: student.id, label: student.name}))))
            .catch((error) => console.error("Error fetching students:", error));
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleTutorChange = (selectedOption) => {
        setFormData({...formData, tutor_id: selectedOption.value});
    };

    const handleStudentChange = (selectedOption) => {
        setFormData({...formData, student_id: selectedOption.value});
    };

    const handleStartDateChange = (date) => {
        setFormData({...formData, timeStart: date});
    };

    const handleEndDateChange = (date) => {
        setFormData({...formData, timeEnd: date});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Виклик функції для збереження
    };

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <div className={`table-container ${isSidebarOpen ? "shrinked" : ""}`}>
                <form onSubmit={handleSubmit}>
                    <h2>Додати заняття</h2>

                    <div>
                        <label>Викладач:</label>
                        <Select
                            options={tutors}
                            onChange={handleTutorChange}
                            placeholder="Виберіть викладача"
                        />
                    </div>

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
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Введіть предмет"
                        />
                    </div>

                    <div>
                        <label>Початок заняття:</label>
                        <DatePicker
                            selected={formData.timeStart}
                            onChange={handleStartDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            placeholderText="Виберіть дату і час"
                            showMonthYearDropdown/>
                    </div>

                    <div>
                        <label>Кінець заняття:</label>
                        <DatePicker
                            selected={formData.timeEnd}
                            onChange={handleEndDateChange}
                            showTimeSelect
                            dateFormat="Pp"
                            placeholderText="Виберіть дату і час"
                            showMonthYearDropdown/>
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
