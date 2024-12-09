import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../hooks/api';
import Navbar from './navbar/Navbar';

export default function AddLesson() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        subject_id: '',
        student_ids: [],
        timeStart: null,
        timeEnd: null,
        summary: '',
    });

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); // New state variable
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectsResponse, studentsResponse] = await Promise.all([
                    api.get('/api/subjects'),
                    api.get('/api/students/my'),
                ]);
                setSubjects(subjectsResponse.data);
                setStudents(studentsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMsg('Failed to load data. Please try again later.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTimeStartChange = (newValue) => {
        setFormData((prev) => ({
            ...prev,
            timeStart: newValue,
        }));
    };

    const handleTimeEndChange = (newValue) => {
        setFormData((prev) => ({
            ...prev,
            timeEnd: newValue,
        }));
    };

    const isFormValid = () => {
        return (
            formData.subject_id &&
            formData.student_ids.length > 0 &&
            formData.timeStart &&
            formData.timeEnd &&
            formData.timeStart < formData.timeEnd
        );
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                subject_id: formData.subject_id,
                student_ids: formData.student_ids,
                time_start: formData.timeStart.toISOString(),
                time_end: formData.timeEnd.toISOString(),
                summary: formData.summary || null,
            };

            await api.post('/api/lessons', payload);

            // Reset form data
            setFormData({
                subject_id: '',
                student_ids: [],
                timeStart: null,
                timeEnd: null,
                summary: '',
            });

            // Show success message
            setSuccessMsg('Lesson added successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error creating lesson:', error);
            setErrorMsg('Failed to create lesson. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        setErrorMsg('');
        setSuccessMsg('');
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Add Lesson
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box component="form" sx={{ mt: 2 }}>
                            {/* Subject Selection */}
                            <FormControl variant="outlined" fullWidth margin="normal" required>
                                <InputLabel id="subject-label">Subject</InputLabel>
                                <Select
                                    labelId="subject-label"
                                    id="subject_id"
                                    name="subject_id"
                                    value={formData.subject_id}
                                    onChange={handleFormChange}
                                    label="Subject"
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Students Selection */}
                            <FormControl variant="outlined" fullWidth margin="normal" required>
                                <InputLabel id="student-label">Students</InputLabel>
                                <Select
                                    labelId="student-label"
                                    id="student_ids"
                                    multiple
                                    name="student_ids"
                                    value={formData.student_ids}
                                    onChange={handleFormChange}
                                    label="Students"
                                    renderValue={(selected) =>
                                        students
                                            .filter((student) => selected.includes(student.id))
                                            .map((student) => `${student.name} ${student.surname}`)
                                            .join(', ')
                                    }
                                >
                                    {students.map((student) => (
                                        <MenuItem key={student.id} value={student.id}>
                                            {student.name} {student.surname}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Time Start */}
                            <DateTimePicker
                                label="Start Time"
                                value={formData.timeStart}
                                onChange={handleTimeStartChange}
                                renderInput={(params) => (
                                    <TextField {...params} margin="normal" fullWidth required />
                                )}
                            />

                            {/* Time End */}
                            <DateTimePicker
                                label="End Time"
                                value={formData.timeEnd}
                                onChange={handleTimeEndChange}
                                renderInput={(params) => (
                                    <TextField {...params} margin="normal" fullWidth required />
                                )}
                            />

                            {/* Summary */}
                            <TextField
                                label="Summary"
                                name="summary"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={formData.summary}
                                onChange={handleFormChange}
                                multiline
                                rows={4}
                            />

                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleSubmit}
                                disabled={!isFormValid()}
                            >
                                Create Lesson
                            </Button>
                        </Box>
                    </LocalizationProvider>
                )}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={errorMsg ? 'error' : 'success'}
                        sx={{ width: '100%' }}
                    >
                        {errorMsg || successMsg}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
}
