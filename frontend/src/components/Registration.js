import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../api/axios";

const REGISTER_URL = '/auth/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, name, surname, password, phone])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPwd) {
            setErrMsg('Passwords do not match');
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('email', email);
            params.append('name', name);
            params.append('surname', surname);
            params.append('password', password);
            params.append('phone', phone);
            const response = await axios.post(REGISTER_URL,
                params,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            setSuccess(true);
            setEmail('');
            setPassword('');
            setConfirmPwd('');
            navigate('/'); // Перенаправлення на сторінку входу після реєстрації
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section className="login-container">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <h1 className="login-title">Sign Up</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <label className="login-label">Email:</label>
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

                <label className="login-label">Name:</label>
                <input
                    type="text"
                    id="name"
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                    className="login-input"
                />

                <label className="login-label">Surname:</label>
                <input
                    type="text"
                    id="surname"
                    autoComplete="off"
                    onChange={(e) => setSurname(e.target.value)}
                    value={surname}
                    required
                    className="login-input"
                />

                <label className="login-label">Phone:</label>
                <input
                    type="text"
                    id="phone"
                    autoComplete="off"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    required
                    className="login-input"
                />

                <label className="login-label">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    className="login-input"
                />

                <label className="login-label">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    value={confirmPwd}
                    required
                    className="login-input"
                />

                <button className="login-button">Sign Up</button>
            </form>
            <p className="login-footer">
                Already have an account?<br/>
                <span className="line">
                    <Link to="/" className="login-link">Sign In</Link>
                </span>
            </p>
        </section>
    );
}

export default Register;
