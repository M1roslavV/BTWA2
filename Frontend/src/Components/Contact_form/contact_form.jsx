import img from "../../images/service_Office_Desk.png"
import Button1 from "../Button1/button1.jsx"

const Contact_form = () => {
    return (
        <section className="main-contact" style={{backgroundImage: `url(${img})`}}>
            <div className="contact-text">
                <h4>JAK MŮŽEME POMOCT?</h4>
                <h3>Jsme kreativní designová agentura pro inventarizaci</h3>
                <p>Efektivní inventarizace je klíčem k udržení vašeho podnikání v chodu. Pokud hledáte partnera, který
                    vám poskytne přesné a rychlé výsledky, kontaktujte nás. Naši specialisté vám zajistí, že váš majetek
                    bude pečlivě zdokumentován a správně ohodnocen.</p>
                <Button1 text={"Kontaktuj nás"} odkaz={"/"}/>
            </div>
        </section>
    );
}

export default Contact_form