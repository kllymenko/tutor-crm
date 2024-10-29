import {useRef, useState, useEffect} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';

const LOGIN_URL = '/auth/login';

const Login = () => {

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
        const params = new URLSearchParams();
        params.append("email", email);
        params.append("password", password);
        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: params.toString()
        }).then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    localStorage.setItem('accessToken', data.access_token);
                    localStorage.setItem('refreshToken', data.refresh_token);

                    console.log(data);
                    navigate('/lessons');
                    window.location.reload();

                });
            } else if (response.status === 401) {
                return response.json().then(errorData => {
                    setErrMsg(errorData.message);
                });
            } else {
                return response.json().then(() => {
                    setErrMsg("Виникла помилка. Будь ласка, спробуйте пізніше.");
                    throw new Error("Network response was not ok.");
                });
            }
        }).catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
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