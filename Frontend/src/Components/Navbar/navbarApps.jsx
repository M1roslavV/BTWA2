import img1 from "../../images/logo.png"
import {Link} from "react-router-dom";

const NavbarApps = () => {

    const toggleDisplay =() =>{

    }

    return (
        <div className="navbar-apps">
            <Link to={"/"} className="navbar-apps-img">
                <img src={img1} alt=""/>
            </Link>
            <div className="navbar-icons">
                <i className="bi bi-bell-fill" onClick={() => toggleDisplay("notice")}></i>
                <i className="bi bi-menu-up" onClick={() => toggleDisplay("apps")}></i>
                <i className="bi bi-calendar2-day" onClick={() => toggleDisplay("calendar")}></i>
                <i className="bi bi-person-fill" onClick={() => toggleDisplay("profil")}></i>
            </div>

        </div>
    )
}

export default NavbarApps;