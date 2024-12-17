import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import img from "../../images/5442676.jpg";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else {
                setError("Přihlášení se nezdařilo. Zkontrolujte údaje a zkuste to znovu.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Chyba na straně serveru");
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
                        <p>Don´t have an account?</p>
                        <a href="sign_up.html" className="btn-secondary">Get started!</a>
                        <p>Read our <a href="#" className="terms-link">terms</a> and <a href="#" className="terms-link">conditions</a>
                        </p>
                    </div>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <h3>Account Sign in</h3>
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
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-footer">
                        <label className="remember">
                            <input type="checkbox" /> Remember me!
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

export default LoginForm;
