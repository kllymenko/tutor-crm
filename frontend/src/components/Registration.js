import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrors({});
    }, [email, name, surname, password, phone, confirmPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPwd) {
            setErrors({ passwordMatch: 'Passwords do not match' });
            return;
        }

        const params = new URLSearchParams();
        params.append('email', email);
        params.append('name', name);
        params.append('surname', surname);
        params.append('password', password);
        params.append('phone', phone);

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            });

            setIsLoading(false);
            if (response.ok) {
                const data = await response.json();
                setSuccessMessage('Реєстрація пройшла успішно. Будь ласка, перевірте свою електронну пошту для підтвердження акаунту.');
                setEmail('');
                setName('');
                setSurname('');
                setPassword('');
                setConfirmPwd('');
                setPhone('');
                setErrors({});
            } else if (response.status === 400) {
                const errorData = await response.json();
                setErrors({ general: errorData.message });
            } else {
                setErrors({ general: 'Виникла помилка. Будь ласка, спробуйте пізніше.' });
            }
        } catch (error) {
            setIsLoading(false);
            console.error('There was a problem with the fetch operation:', error);
            setErrors({ general: 'Виникла помилка під час реєстрації. Спробуйте пізніше.' });
        }
    };

    return (
        <section className="login-container">
            <p className={errors.general || errors.passwordMatch ? "errors" : "offscreen"} aria-live="assertive">
                {errors.general || errors.passwordMatch}
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

                <button className="login-button" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
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
