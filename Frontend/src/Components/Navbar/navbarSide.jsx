import {useState} from "react";
import {Link} from "react-router-dom";
import userRole from "../../userRole.jsx";

const NavbarSide = () => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const {role} = userRole();

        const toggleMenu = () => {
            setIsMenuOpen(!isMenuOpen);
        };

        const logout = () => {
            localStorage.removeItem("token");
        }

        return (
        <div className={`navbar-side ${isMenuOpen ? 'open-side-menu' : ''}`}>
            <div className="toggle-menu-side" onClick={toggleMenu}>
                <i className="bi bi-list"></i>
            </div>
            <div className="navbar-side-links">
                <Link to="/dashboard"><i className="bi bi-house-fill"></i> <span>Home</span></Link>
                {(role === "Admin" || role === "Správce majetku") && (
                    <>
                        <Link to="/list"><i className="bi bi-boxes"></i> <span>Property</span></Link>
                    </>
                )}
                <a href="#"><i className="bi bi-people-fill"></i> <span>Employees</span></a>
                <a href="#"><i className="bi bi-bell-fill"></i> <span>Notice</span></a>
                <a href="#"><i className="bi bi-chat-dots-fill"></i> <span>Chat</span></a>
                <a href="#"><i className="bi bi-person-fill"></i> <span>Profile</span></a>
                <a href="#"><i className="bi bi-gear-fill"></i> <span>Setting</span></a>
                <Link to="/logout" onClick={logout}><i className="bi bi-box-arrow-in-left"></i> <span>Logout</span></Link>
            </div>
        </div>
    )
}

export default NavbarSide;