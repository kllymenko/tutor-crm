import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    TablePagination,
    TableSortLabel,
    TextField,
    IconButton,
    Modal,
    Fade,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    AddCircle as AddCircleIcon,
} from '@mui/icons-material';
import Navbar from './navbar/Navbar';
import api from '../hooks/api';

export default function Students() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Table state
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');

    // Edit Student Modal State
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({
        name: '',
        surname: '',
        phone: '',
        price_per_lesson: '',
        subjects: [],
    });
    const [originalStudent, setOriginalStudent] = useState(null);

    // Add Payment Modal State
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        amount: '',
        method: '',
        student_id: null,
    });

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    useEffect(() => {
        const fetchStudentsAndSubjects = async () => {
            try {
                const [studentsResponse, subjectsResponse] = await Promise.all([
                    api.get('/api/students/my'),
                    api.get('/api/subjects'),
                ]);
                setStudents(studentsResponse.data);
                setSubjects(subjectsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMsg('Failed to load data. Please try again later.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentsAndSubjects();
    }, []);

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    // Sorting functions
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const orderComp = comparator(a[0], b[0]);
            if (orderComp !== 0) return orderComp;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const getComparator = (orderDir, orderByProp) => {
        return orderDir === 'desc'
            ? (a, b) => descendingComparator(a, b, orderByProp)
            : (a, b) => -descendingComparator(a, b, orderByProp);
    };

    const descendingComparator = (a, b, orderByProp) => {
        if (b[orderByProp] < a[orderByProp]) return -1;
        if (b[orderByProp] > a[orderByProp]) return 1;
        return 0;
    };

    // Pagination functions
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Search filtering
    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredStudents = students.filter((student) =>
        Object.values(student).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, filteredStudents.length - page * rowsPerPage);

    // Edit Student Handlers
    const handleEditClick = (student) => {
        setCurrentStudent({ ...student }); // Clone the student object
        setOriginalStudent({ ...student }); // Store original data
        setOpenEditModal(true);
    };

    const handleEditModalClose = () => {
        setOpenEditModal(false);
        setCurrentStudent({
            name: '',
            surname: '',
            phone: '',
            price_per_lesson: '',
            subjects: [],
        });
        setOriginalStudent(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentStudent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const hasStudentChanged = () => {
        if (!currentStudent || !originalStudent) return false;

        return (
            currentStudent.name !== originalStudent.name ||
            currentStudent.surname !== originalStudent.surname ||
            currentStudent.phone !== originalStudent.phone ||
            currentStudent.price_per_lesson !== originalStudent.price_per_lesson ||
            !arraysEqual(
                currentStudent.subjects.map((s) => s.id),
                originalStudent.subjects.map((s) => s.id)
            )
        );
    };

    const arraysEqual = (a, b) => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((element, index) => element === sortedB[index]);
    };

    const handleEditSubmit = async () => {
        try {
            await api.put(`/api/students/${currentStudent.id}`, currentStudent);
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === currentStudent.id ? currentStudent : student
                )
            );
            setOpenEditModal(false);
            setCurrentStudent({
                name: '',
                surname: '',
                phone: '',
                price_per_lesson: '',
                subjects: [],
            });
            setOriginalStudent(null);
        } catch (error) {
            console.error('Error updating student:', error);
            setErrorMsg('Failed to update student. Please try again.');
            setOpenSnackbar(true);
        }
    };

    // Payment Handlers
    const handlePaymentClick = (student) => {
        setPaymentData({
            amount: '',
            method: '',
            student_id: student.id,
        });
        setOpenPaymentModal(true);
    };

    const handlePaymentModalClose = () => {
        setOpenPaymentModal(false);
        setPaymentData({
            amount: '',
            method: '',
            student_id: null,
        });
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isPaymentFormValid = () => {
        return (
            paymentData.amount &&
            parseFloat(paymentData.amount) > 0 &&
            paymentData.method
        );
    };

    const handlePaymentSubmit = async () => {
        try {
            await api.post('/api/payments', paymentData);
            // Refresh student data to update balance
            const studentsResponse = await api.get('/api/students/my');
            setStudents(studentsResponse.data);
            setOpenPaymentModal(false);
            setPaymentData({
                amount: '',
                method: '',
                student_id: null,
            });
        } catch (error) {
            console.error('Error adding payment:', error);
            setErrorMsg('Failed to add payment. Please try again.');
            setOpenSnackbar(true);
        }
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Students
                    </Typography>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer>
                                <Table aria-label="students table">
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
                                            <TableCell sortDirection={orderBy === 'name' ? order : false}>
                                                <TableSortLabel
                                                    active={orderBy === 'name'}
                                                    direction={orderBy === 'name' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('name')}
                                                >
                                                    Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell sortDirection={orderBy === 'surname' ? order : false}>
                                                <TableSortLabel
                                                    active={orderBy === 'surname'}
                                                    direction={orderBy === 'surname' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('surname')}
                                                >
                                                    Surname
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Subjects</TableCell>
                                            <TableCell
                                                sortDirection={orderBy === 'price_per_lesson' ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={orderBy === 'price_per_lesson'}
                                                    direction={orderBy === 'price_per_lesson' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('price_per_lesson')}
                                                >
                                                    Price per Lesson
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell sortDirection={orderBy === 'balance' ? order : false}>
                                                <TableSortLabel
                                                    active={orderBy === 'balance'}
                                                    direction={orderBy === 'balance' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('balance')}
                                                >
                                                    Balance
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stableSort(filteredStudents, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((student) => (
                                                <TableRow hover key={student.id}>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="more"
                                                            onClick={() => handleEditClick(student)}
                                                        >
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{student.id}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.surname}</TableCell>
                                                    <TableCell>{student.phone}</TableCell>
                                                    <TableCell>
                                                        {student.subjects.map((subject) => subject.name).join(', ')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Intl.NumberFormat('uk-UA', {
                                                            style: 'currency',
                                                            currency: 'UAH',
                                                        }).format(student.price_per_lesson)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Intl.NumberFormat('uk-UA', {
                                                            style: 'currency',
                                                            currency: 'UAH',
                                                        }).format(student.balance)}
                                                        <IconButton
                                                            aria-label="add payment"
                                                            color="success"
                                                            onClick={() => handlePaymentClick(student)}
                                                        >
                                                            <AddCircleIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>
                                                        {/* Additional actions can be added here */}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={9} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredStudents.length}
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

            {/* Edit Student Modal */}
            <Modal
                open={openEditModal}
                onClose={handleEditModalClose}
                closeAfterTransition
            >
                <Fade in={openEditModal}>
                    <Container maxWidth="sm" sx={{ mt: 10, bgcolor: 'background.paper', p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Edit Student
                        </Typography>
                        {currentStudent && (
                            <Box component="form" sx={{ mt: 2 }}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={currentStudent.name || ''}
                                    onChange={handleEditChange}
                                    required
                                />
                                <TextField
                                    label="Surname"
                                    name="surname"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={currentStudent.surname || ''}
                                    onChange={handleEditChange}
                                />
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={currentStudent.phone || ''}
                                    onChange={handleEditChange}
                                    required
                                />
                                <TextField
                                    label="Price per Lesson"
                                    name="price_per_lesson"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    value={currentStudent.price_per_lesson || ''}
                                    onChange={handleEditChange}
                                    required
                                    slotProps={{
                                        input: {
                                            min: 0,
                                            step: 0.01,
                                        },
                                    }}
                                />
                                {/* Subjects Selection */}
                                <FormControl variant="outlined" fullWidth margin="normal" required>
                                    <InputLabel id="subject-label">Subjects</InputLabel>
                                    <Select
                                        labelId="subject-label"
                                        id="subject_ids"
                                        multiple
                                        name="subject_ids"
                                        value={
                                            currentStudent.subjects
                                                ? currentStudent.subjects.map((subject) => subject.id)
                                                : []
                                        }
                                        onChange={(e) => {
                                            const selectedIds = e.target.value;
                                            const selectedSubjects = subjects.filter((subject) =>
                                                selectedIds.includes(subject.id)
                                            );
                                            setCurrentStudent((prev) => ({
                                                ...prev,
                                                subjects: selectedSubjects,
                                            }));
                                        }}
                                        label="Subjects"
                                    >
                                        {subjects.map((subject) => (
                                            <MenuItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleEditSubmit}
                                    disabled={!hasStudentChanged()}
                                >
                                    Save
                                </Button>
                            </Box>
                        )}
                    </Container>
                </Fade>
            </Modal>

            {/* Add Payment Modal */}
            <Modal
                open={openPaymentModal}
                onClose={handlePaymentModalClose}
                closeAfterTransition
            >
                <Fade in={openPaymentModal}>
                    <Container maxWidth="sm" sx={{ mt: 10, bgcolor: 'background.paper', p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Add Payment
                        </Typography>
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                label="Amount"
                                name="amount"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                                value={paymentData.amount || ''}
                                onChange={handlePaymentChange}
                                required
                                error={paymentData.amount !== '' && parseFloat(paymentData.amount) <= 0}
                                helperText={
                                    paymentData.amount !== '' && parseFloat(paymentData.amount) <= 0
                                        ? 'Amount must be greater than zero'
                                        : ''
                                }
                            />
                            <FormControl variant="outlined" fullWidth margin="normal" required>
                                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                                <Select
                                    labelId="payment-method-label"
                                    name="method"
                                    value={paymentData.method || ''}
                                    onChange={handlePaymentChange}
                                    label="Payment Method"
                                >
                                    <MenuItem value="CASH">Cash</MenuItem>
                                    <MenuItem value="CARD">Card</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handlePaymentSubmit}
                                disabled={!isPaymentFormValid()}
                            >
                                Add Payment
                            </Button>
                        </Box>
                    </Container>
                </Fade>
            </Modal>
        </div>
    );
}
