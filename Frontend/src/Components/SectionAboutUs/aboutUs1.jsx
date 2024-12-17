import ImagesAboutUs from "./imagesAboutUs.jsx";

const AboutUs1 = () => {
    return (
        <section className="main-aboutUs">
            <div id="scroll-aboutUs"></div>
            <ImagesAboutUs/>
            <div className="aboutUs-text">
                <h4>O NÁS</h4>
                <h3>Jsme velká firma pro vaše inventury od majetku po zboží</h3>
                <p>Uvědomujeme si, že pro naše klienty je inventarizace zboží velice důležitá součást jejich businessu pro efektivní řízení zásob,  leč mnohdy na tento proces není dostatek zaškolených pracovníků, kteří by inventarizaci provedli, aniž by to nezasáhlo plynulý chod provozu.</p>
                <p>Kromě provozní náročnosti vznikají společnostem také finanční náklady na realizaci inventur zboží. Mezi tyto náklady patří mzdy a odvody zaměstnanců na přípravu, realizaci a vyhodnocení inventur, příplatky za noční směny, cestovní náklady, amortizace vlastní techniky, náklady na zakoupení nebo pronájem software a hardware,údržba a opravy hardware, struktura manažerů centrální kanceláře spravující agendu inventur, drobné náklady na spotřební materiál.</p>
                <p>Naším hlavním mottem a posláním je osvobození klientů od této složité a časově náročné činnosti. Hlavní výhodou je zaškolený tým pracovníků s vlastními zařízeními, prostřednictvím kterých jsme schopni Vám zaručit přesný a objektivní výsledek.</p>
            </div>
        </section>
    )
}

export default AboutUs1;