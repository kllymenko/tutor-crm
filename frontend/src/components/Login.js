import {useRef, useState, useEffect} from 'react';
import useAuth from '../hooks/useAuth';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import axios from "../api/axios";

const LOGIN_URL = '/auth/login';

const Login = () => {
    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const params = new URLSearchParams();
            params.append('email', email);
            params.append('password', password);

            const response = await axios.post(LOGIN_URL,
                params,
                {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            setEmail('');
            setPassword('');
            navigate('/home');
        } catch (err) {
            if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                console.log(err)
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (

        <section className="login-container">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <h1 className="login-title">Sign In</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="username" className="login-label">Username:</label>
                <input
                    type="email"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    className="login-input"
                />

                <label htmlFor="password" className="login-label">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    className="login-input"
                />
                <button className="login-button">Sign In</button>
            </form>
            <p className="login-footer">
                Need an Account?<br/>
                <span className="line">
                    <Link to="/registration" className="login-link">Sign Up</Link>
                </span>
            </p>
        </section>
    );
};

export default Login