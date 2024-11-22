import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
    Snackbar,
} from '@mui/material';

const REGISTER_URL = '/auth/register';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
        phone: '',
        password: '',
        confirmPwd: '',
    });

    const [errors, setErrors] = useState({});
    const [errMsg, setErrMsg] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        email,
        name,
        surname,
        phone,
        password,
        confirmPwd,
    } = formData;

    const handleChange = (e) => {
        const { name: fieldName, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: '',
        }));
        setErrMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        setSuccessMessage('');
        setIsLoading(true);

        // Client-side validation
        let validationErrors = {};
        if (!email) validationErrors.email = 'Email is required';
        if (!name) validationErrors.name = 'Name is required';
        if (!surname) validationErrors.surname = 'Surname is required';
        if (!phone) validationErrors.phone = 'Phone is required';
        if (!password) validationErrors.password = 'Password is required';
        if (password !== confirmPwd)
            validationErrors.confirmPwd = 'Passwords do not match';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('email', email);
            params.append('name', name);
            params.append('surname', surname);
            params.append('password', password);
            params.append('phone', phone);

            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            });

            if (response.ok) {
                setSuccessMessage(
                    'Registration successful! Please check your email to confirm your account.'
                );
                setFormData({
                    email: '',
                    name: '',
                    surname: '',
                    phone: '',
                    password: '',
                    confirmPwd: '',
                });
                setErrors({});
                // Optionally redirect to login page after a delay
                setTimeout(() => {
                    navigate('/');
                }, 5000);
            } else {
                const errorData = await response.json();
                setErrMsg(errorData.message || 'Registration failed.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setErrMsg('Network error. Please try again later.');
            setOpenSnackbar(true);
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Name"
                        name="name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Surname"
                        name="surname"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={surname}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.surname)}
                        helperText={errors.surname}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phone}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.phone)}
                        helperText={errors.phone}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Confirm Password"
                        name="confirmPwd"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={confirmPwd}
                        onChange={handleChange}
                        required
                        error={Boolean(errors.confirmPwd)}
                        helperText={errors.confirmPwd}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Sign Up'}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Sign In
                        </Link>
                    </Typography>
                </form>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {errMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Register;
