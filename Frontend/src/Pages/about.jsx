import Navbar from "../Components/Navbar/navbar.jsx";
import Contact from "../Components/Contact_form/contact_form.jsx";
import Reviews from "../Components/Reviews/reviews.jsx";
import Footer from "../Components/Footer/footer.jsx";
import Header2 from "../Components/Header/header2.jsx";
import AboutUs1 from "../Components/SectionAboutUs/aboutUs1.jsx";

const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <Header2 />
            <AboutUs1 />
            <Contact />
            <Reviews />
            <Footer />
        </div>
    )
}

export default AboutUs