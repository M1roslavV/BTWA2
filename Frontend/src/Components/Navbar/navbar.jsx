import {useState, useEffect} from "react";
import logo from '../../images/logo.png';
import {Link} from "react-router-dom";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsTokenValid(false);
                return;
            }
            try {
                const response = await fetch("http://localhost:8080/api/validate-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsTokenValid(true);
                } else {
                    localStorage.removeItem("token");
                    setIsTokenValid(false);
                }
            } catch (err) {
                console.error("Error verifying token:", err);
                localStorage.removeItem("token");
                setIsTokenValid(false);
            }
        };

        verifyToken();
    }, [token]);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </Link>
                <button className="navbar-toggle"  onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="bi bi-list" viewBox="0 0 15 15">
                        <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                </button>
                <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
                    <ul className="navbar-list">
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/">Domů</Link>
                        </li>
                        <li className="navbar-item">
                        <a className="navbar-link" href="#scroll-aboutUs">O nás</a>
                        </li>
                        <li className="navbar-item">
                            <a className="navbar-link" href="#scroll-reviews">Recenze</a>
                        </li>
                        <li className="navbar-item">
                            <a className="navbar-link" href="#scroll-pricer">Ceník</a>
                        </li>
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/login">Přihlášení</Link>
                        </li>
                        <li className="navbar-item">
                            <Link className="navbar-link" to="/register">Registrace</Link>
                        </li>
                        {(isTokenValid) ?
                            <li className="navbar-item">
                                <Link className="navbar-link" to="/dashboard">Dashboard</Link>
                            </li> : <li></li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
