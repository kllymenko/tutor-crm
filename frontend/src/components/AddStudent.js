import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Snackbar,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    OutlinedInput,
} from '@mui/material';
import Navbar from './navbar/Navbar';
import api from '../hooks/api';

const STUDENTS_URL = '/api/students';
const SUBJECTS_URL = '/api/subjects';

export default function AddStudent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        price_per_lesson: '',
        subject_ids: [],
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        // Fetch subjects from the API
        const fetchSubjects = async () => {
            try {
                const response = await api.get(SUBJECTS_URL);
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                setErrorMsg('Failed to load subjects. Please try again later.');
                setOpenSnackbar(true);
            }
        };

        fetchSubjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMsg('');
    };

    const handleSubjectChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData({
            ...formData,
            subject_ids: typeof value === 'string' ? value.split(',') : value,
        });
        setErrorMsg('');
    };

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMessage('');

        // Client-side validation
        if (
            !formData.name ||
            !formData.phone ||
            !formData.price_per_lesson ||
            formData.subject_ids.length === 0
        ) {
            setErrorMsg('Please fill in all required fields and select at least one subject.');
            setOpenSnackbar(true);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post(STUDENTS_URL, formData);

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage('Student added successfully!');
                setFormData({
                    name: '',
                    surname: '',
                    phone: '',
                    price_per_lesson: '',
                    subject_ids: [],
                });
            } else {
                throw new Error('Failed to save student.');
            }
        } catch (error) {
            console.error('Error saving student:', error);
            setErrorMsg(error.response?.data?.message || 'Failed to save student. Please try again.');
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Add Student
                    </Typography>
                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {successMessage}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Surname"
                            name="surname"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.surname}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Price per Lesson"
                            name="price_per_lesson"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            inputProps={{ min: 0, step: 0.01 }}
                            value={formData.price_per_lesson}
                            onChange={handleChange}
                            required
                        />
                        <FormControl variant="outlined" fullWidth margin="normal" required>
                            <InputLabel id="subject-label">Subjects</InputLabel>
                            <Select
                                labelId="subject-label"
                                id="subject_ids"
                                multiple
                                value={formData.subject_ids}
                                onChange={handleSubjectChange}
                                input={<OutlinedInput label="Subjects" />}
                                renderValue={(selected) => {
                                    const selectedSubjects = subjects.filter((subject) =>
                                        selected.includes(subject.id)
                                    );
                                    return selectedSubjects.map((subject) => subject.name).join(', ');
                                }}
                            >
                                {subjects.map((subject) => (
                                    <MenuItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={isLoading}
                            startIcon={isLoading && <CircularProgress size={20} />}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </form>
                </Box>
            </Container>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </div>
    );
}
