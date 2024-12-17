import NavbarSide from "../Navbar/navbarSide.jsx";
import NavbarApps from "../Navbar/navbarApps.jsx";
import PropTypes from "prop-types";

const AppLayout = ({children}) =>{
    return (
        <div className="container-dashboard">
            <NavbarSide/>
            <div className="content-dashboard">
                <NavbarApps/>
                <div className="sections-dashboard">
                    {children}
                </div>
            </div>
        </div>
    )
}

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AppLayout;