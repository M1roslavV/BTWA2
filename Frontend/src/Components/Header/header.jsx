import { useState, useEffect } from "react";
import BgImg from "../../images/5442676.jpg"
import "../../styles/main.css"

const Header = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselItems = [
        {text: "MyProperty vám umožní mít všechny informace o vašem majetku na dosah ruky. Rychlý přístup, jasná evidence a perfektní přehled bez složitých tabulek a dokumentů.", title: "Mějte svůj majetek pod kontrolou, kdykoliv a kdekoliv!"},
        {text: "S MyProperty můžete bezpečně ukládat všechny důležité informace o vašem majetku, ať už jde o nemovitosti, vozidla nebo jiné cennosti. Vaše data jsou chráněna, aby vám poskytla klid v každé situaci.", title: "Bezpečné uchovávání dat pro vaši jistotu"},
        {text: "Spravujte všechny své cennosti na jednom místě! MyProperty vám umožní snadno sledovat hodnotu, údržbu a historii majetku. Neztrácejte čas papírováním, využijte moderní nástroje pro rychlé rozhodování.", title: "Zjednodušte správu majetku a ušetřete čas!"}
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        }, 20000);

        return () => clearInterval(interval); // Vyčištění intervalu při odmontování komponenty
    }, [carouselItems.length]);

    return (
        <div className="slideshow-container" style={{backgroundImage: `url(${BgImg})`}}>
            <div className="carousel-inner">
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === currentIndex ? "active" : ""}`}
                    >
                        <h1>{item.title}</h1>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Header;
