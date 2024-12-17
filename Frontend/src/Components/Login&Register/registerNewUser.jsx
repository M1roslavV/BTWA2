import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import img from "../../images/5442676.jpg";

const RegisterForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{7,}$/;

    useEffect(() => {
        const fetchEmail = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get('email');

            console.log(emailParam);
            setEmail(emailParam);
        };

        fetchEmail();
    }, []);



    const handleRegisterNewUser = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Hesla se neshodují!");
            return;
        }
        if (!passwordPattern.test(password)) {
            setError("Heslo musí obsahovat alespoň jedno malé písmeno, jedno velké písmeno, speciální znak a číslo.");
            console.log(password)
            return;
        }


        console.log(password, firstName, lastName, email);
        try {
            const response = await fetch("http://localhost:8080/api/registerNewUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password }),
            });

            if (response.ok) {
                navigate("/login");
                alert("Byli jste úspěšně zaregistrovaný a přiřazený k daný firmě, teď stačí ověřit email:)")
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("Registrace se nezdařila kvůli problému se serverem.");
        }
    };


    return (
        <div className="login-page" style={{ backgroundImage: `url(${img})` }}>
            <div className="sign-container">
                <div className="sign-detail">
                    <div className="sign-text">
                        <Link to="/" className="site-title">
                            <h1>MyProperty</h1>
                        </Link>
                        <p>With the power of MyProperty, you can now focus only on functionaries for
                            your digital products, while leaving the UI design on us!</p>
                        <p>Do you have an account?</p>
                        <Link to="/login" className="btn-secondary">Sign in</Link>
                        <p>Read our <a href="#" className="terms-link">terms</a> and <a href="#" className="terms-link">conditions</a>
                        </p>
                    </div>
                </div>
                <form className="login-form" onSubmit={handleRegisterNewUser}>
                    <h3>Account Sign in</h3>
                    <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', width: '100%', alignItems: 'end'}}>
                        <div className="input-group" style={{width: '47%', minWidth: '100px'}}>
                            <label htmlFor="firstName">First name</label>
                            <input
                                type="test"
                                id="firstName"
                                className="input-field"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} required
                            />
                        </div>
                        <div className="input-group" style={{width: '47%', minWidth: '100px'}}>
                            <label htmlFor="lastName">Last name</label>
                            <input
                                type="test"
                                id="lastName"
                                className="input-field"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)} required
                            />
                        </div>
                    </div>
                    <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', width: '100%', alignItems: 'end'}}>
                        <div className="input-group" style={{width: '47%', minWidth: '100px'}}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-group" style={{width: '47%', minWidth: '100px'}}>
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="input-field"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-footer">
                        <label className="remember">
                            <input type="checkbox"/> Remember me!
                        </label>
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="btn-primary">Sign in</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
