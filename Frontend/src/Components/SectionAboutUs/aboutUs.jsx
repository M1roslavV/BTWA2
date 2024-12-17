import ImagesAboutUs from "./imagesAboutUs.jsx";
import Button1 from "../Button1/button1.jsx";

const AboutUs = () => {
    return (
        <section className="main-aboutUs">
            <div id="scroll-aboutUs"></div>
            <ImagesAboutUs />
            <div className="aboutUs-text">
                <h4>O NÁS</h4>
                <h3>Jsme velká firma pro vaše inventury od majetku po zboží</h3>
                <p>Uvědomujeme si, že pro naše klienty je inventarizace zboží velice důležitá součást jejich businessu
                    pro efektivní řízení zásob, leč mnohdy na tento proces není dostatek zaškolených pracovníků...</p>
                <p>Naším hlavním mottem a posláním je osvobození klientů od této složité a časově náročné činnosti.
                    Hlavní výhodou je zaškolený tým pracovníků s vlastními zařízeními...</p>
                <Button1 text={"Číst více"} odkaz={"/aboutUs"}/>
            </div>
        </section>
    )
}

export default AboutUs;