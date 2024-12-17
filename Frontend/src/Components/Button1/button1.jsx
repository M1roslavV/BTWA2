import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const Button1 = ({text, odkaz}) => {
    return (
        <Link to={odkaz} className={"btn1"}>{text}</Link>
    )
}

Button1.propTypes = {
    text: PropTypes.string.isRequired,
    odkaz: PropTypes.string.isRequired
}

export default Button1;