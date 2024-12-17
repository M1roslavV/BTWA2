import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import img from "../../images/5442676.jpg";

const RegisterForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{7,}$/;




    const handleRegister = async (e) => {
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

        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, companyName, email, password }),
            });

            if (response.ok) {
                navigate("/");
                alert("Byli jste úspěšně zaregistrovaný, teď stačí ověřit email:)")
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
                        <a href="sign_up.html" className="btn-secondary">Sign in</a>
                        <p>Read our <a href="#" className="terms-link">terms</a> and <a href="#" className="terms-link">conditions</a>
                        </p>
                    </div>
                </div>
                <form className="login-form" onSubmit={handleRegister}>
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
                    <div className="input-group">
                        <label htmlFor="companyName">Company name</label>
                        <input
                            type="text"
                            id="companyName"
                            className="input-field"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
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
