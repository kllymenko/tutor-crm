import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert, Snackbar } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        setIsLoading(true);

        try {
            const params = new URLSearchParams();
            params.append('email', email);
            params.append('password', password);

            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Access Token:', data.access_token);
                console.log('Refresh Token:', data.refresh_token);

                localStorage.setItem('accessToken', data.access_token.trim());
                localStorage.setItem('refreshToken', data.refresh_token.trim());
                localStorage.setItem('role', data.role)
                navigate('/lessons');
            } else {
                const errorData = await response.json();
                setErrMsg(errorData.message || 'Login failed. Please check your credentials.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setErrMsg('Network error. Please try again later.');
            setOpenSnackbar(true);
            console.error('Login error:', error);
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
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account?{' '}
                        <Link to="/registration" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Sign Up
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

export default Login;
