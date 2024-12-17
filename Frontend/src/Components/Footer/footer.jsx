import img from "../../images/5442676.jpg"
import {Link} from "react-router-dom";

const Footer = () =>{
    const links = [
        {href: "#scroll-service", text: "SLUŽBY"},
        {href: "#scroll-aboutUs", text: "O NÁS"},
        {href: "#scroll-reviews", text: "RECENZE"},
        {href: "#scroll-pricer", text: "CENÍK"},
    ]
    return (
        <footer className="footer" style={{backgroundImage: `url(${img})`}}>
            <div className="footer-links">
                <h3>Užitečné odkazy</h3>
                <ul className="list">
                    <li className={"link-item"}><Link to="/" className={"link"}>DOMŮ</Link></li>
                    {links.map((link, i) => (
                        <li key={i} className="link-item"><a className={"link"} href={link.href}>{link.text}</a></li>
                    ))}
                </ul>
            </div>
            <div className="footer-contacts">
                <h3>Kontakt</h3>
                <div className="item-contacts d-flex">
                    <img src="images/map.png" alt=""/>
                    <p>Jiráskova 15, 520 08 Pardubice</p>
                </div>
                <div className="item-contacts d-flex">
                    <img src="images/email.png" alt=""/>
                    <p>MyProperty@email.cz</p>
                </div>
                <div className="item-contacts d-flex">
                    <img src="images/phone.png" alt=""/>
                    <p>+420 777 666 555</p>
                </div>
            </div>
            <p className="copyright">© copyright 2023 MyProperty</p>
        </footer>
    )
}

export default Footer