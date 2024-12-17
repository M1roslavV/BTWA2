import Navbar from "../Components/Navbar/navbar.jsx";
import Header from "../Components/Header/header.jsx";
import Features from "../Components/Features/features.jsx";
import About from "../Components/SectionAboutUs/aboutUs.jsx";
import Contact from "../Components/Contact_form/contact_form.jsx";
import Reviews from "../Components/Reviews/reviews.jsx";
import Pricer from "../Components/Pricer/pricer.jsx";
import Footer from "../Components/Footer/footer.jsx";

const Home = () => {
    return (
        <div>
            <Navbar />
            <Header />
            <Features />
            <About />
            <Contact />
            <Reviews />
            <Pricer />
            <Footer />
        </div>
    )
}

export default Home