import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    TableSortLabel,
    IconButton,
    Modal,
    Fade,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Navbar from './navbar/Navbar';
import api from '../hooks/api';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

export default function Lessons() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [lessons, setLessons] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Table state
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('timeStart');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Edit modal state
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonsResponse, studentsResponse, subjectsResponse] = await Promise.all([
                    api.get('/api/lessons/my'),
                    api.get('/api/students/my'),
                    api.get('/api/subjects'),
                ]);

                console.log('Lessons Data:', lessonsResponse.data); // Check the structure

                // Initialize studentIds as empty array if undefined
                const lessonsData = (lessonsResponse.data || []).map((lesson) => ({
                    ...lesson,
                    studentIds: lesson.studentIds || [],
                }));

                setLessons(lessonsData);
                setStudents(studentsResponse.data || []);
                setSubjects(subjectsResponse.data || []);
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

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    // Sorting functions remain the same...

    // Edit lesson handlers remain the same...

    // Status change handler remains the same...

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Lessons
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer>
                                <Table aria-label="lessons table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell sortDirection={orderBy === 'id' ? order : false}>
                                                <TableSortLabel
                                                    active={orderBy === 'id'}
                                                    direction={orderBy === 'id' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('id')}
                                                >
                                                    ID
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Subject</TableCell>
                                            <TableCell>Students</TableCell>
                                            <TableCell sortDirection={orderBy === 'timeStart' ? order : false}>
                                                <TableSortLabel
                                                    active={orderBy === 'timeStart'}
                                                    direction={orderBy === 'timeStart' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('timeStart')}
                                                >
                                                    Start Time
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell sortDirection={orderBy === 'timeEnd' ? order : false}>
                                                <TableSortLabel
                                                    active={orderBy === 'timeEnd'}
                                                    direction={orderBy === 'timeEnd' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('timeEnd')}
                                                >
                                                    End Time
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stableSort(lessons, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((lesson) => (
                                                <TableRow hover key={lesson.id}>
                                                    <TableCell>
                                                        <IconButton aria-label="more" onClick={() => handleEditClick(lesson)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{lesson.id}</TableCell>
                                                    <TableCell>
                                                        {subjects.find((s) => s.id === lesson.subjectId)?.name ||
                                                            `Subject ${lesson.subjectId}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {lesson.studentIds?.length > 0
                                                            ? lesson.studentIds
                                                                .map((id) => {
                                                                    const student = students.find((s) => s.id === id);
                                                                    return student
                                                                        ? `${student.name} ${student.surname}`
                                                                        : `Student ${id}`;
                                                                })
                                                                .join(', ')
                                                            : 'No students'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {lesson.timeStart
                                                            ? format(parseISO(lesson.timeStart), 'dd MMM yyyy HH:mm', {
                                                                locale: uk,
                                                            })
                                                            : 'No Start Time'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {lesson.timeEnd
                                                            ? format(parseISO(lesson.timeEnd), 'dd MMM yyyy HH:mm', {
                                                                locale: uk,
                                                            })
                                                            : 'No End Time'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormControl variant="standard" fullWidth>
                                                            <Select
                                                                value={lesson.status}
                                                                onChange={(e) => handleStatusChange(lesson.id, e.target.value)}
                                                            >
                                                                <MenuItem value="PLANNED">Planned</MenuItem>
                                                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                                                <MenuItem value="CANCELED">Canceled</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {rowsPerPage - Math.min(rowsPerPage, lessons.length - page * rowsPerPage) > 0 && (
                                            <TableRow
                                                style={{
                                                    height:
                                                        53 *
                                                        (rowsPerPage - Math.min(rowsPerPage, lessons.length - page * rowsPerPage)),
                                                }}
                                            >
                                                <TableCell colSpan={7} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={lessons.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </Paper>
                    )}
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

            {/* Edit Lesson Modal */}
            <Modal open={openEditModal} onClose={handleEditModalClose} closeAfterTransition>
                <Fade
                    in={openEditModal}
                    onExited={() => {
                        setCurrentLesson(null);
                    }}
                >
                    <Container maxWidth="sm" sx={{ mt: 10, bgcolor: 'background.paper', p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Edit Lesson
                        </Typography>
                        {currentLesson && (
                            <Box component="form" sx={{ mt: 2, position: 'relative' }}>
                                <FormControl variant="outlined" fullWidth margin="normal" required>
                                    <InputLabel id="subject-label">Subject</InputLabel>
                                    <Select
                                        labelId="subject-label"
                                        name="subjectId"
                                        value={currentLesson.subjectId || ''}
                                        onChange={handleEditChange}
                                        label="Subject"
                                    >
                                        {subjects.map((subject) => (
                                            <MenuItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" fullWidth margin="normal" required>
                                    <InputLabel id="student-label">Students</InputLabel>
                                    <Select
                                        labelId="student-label"
                                        name="studentIds"
                                        multiple
                                        value={currentLesson.studentIds || []}
                                        onChange={(e) =>
                                            setCurrentLesson((prev) => ({
                                                ...prev,
                                                studentIds: e.target.value,
                                            }))
                                        }
                                        label="Students"
                                    >
                                        {students.map((student) => (
                                            <MenuItem key={student.id} value={student.id}>
                                                {student.name} {student.surname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <DateTimePicker
                                    label="Start Time"
                                    value={currentLesson.timeStart ? parseISO(currentLesson.timeStart) : null}
                                    onChange={(date) => handleDateChange('timeStart', date)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth margin="normal" required />
                                    )}
                                />
                                <DateTimePicker
                                    label="End Time"
                                    value={currentLesson.timeEnd ? parseISO(currentLesson.timeEnd) : null}
                                    onChange={(date) => handleDateChange('timeEnd', date)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth margin="normal" required />
                                    )}
                                />
                                <TextField
                                    label="Summary"
                                    name="summary"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={currentLesson.summary || ''}
                                    onChange={handleEditChange}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleEditSubmit}
                                    disabled={editLoading}
                                >
                                    {editLoading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                                </Button>
                            </Box>
                        )}
                    </Container>
                </Fade>
            </Modal>
        </div>
    );
}
