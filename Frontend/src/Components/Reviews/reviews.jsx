import { useState, useEffect } from "react";
import img1 from "../../images/stars.png";

const Reviews = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const items = [
        {
            img: img1,
            text: "Tato aplikace pro inventarizaci majetku úplně změnila způsob, jakým spravujeme naše firemní aktiva. Její intuitivní rozhraní a pokročilé funkce nám ušetřily spoustu času a peněz.",
            actor: "Tomáš Malý"
        },
        {
            img: img1,
            text: "Po použití této aplikace jsme si uvědomili, kolik chyb bylo v našich předchozích systémech. Přesnost a spolehlivost, kterou aplikace nabízí, je pro naše podnikání zásadní.",
            actor: "Marek Šťastný"
        },
        {
            img: img1,
            text: "Jsem ohromen tím, jak snadno se s aplikací pracuje. Její uživatelské prostředí je čisté a logické, což značně snižuje čas potřebný k zaškolení nových zaměstnanců.",
            actor: "Matyáš Smutný"
        },
        {
            img: img1,
            text: "Kromě skvělých funkcí aplikace musím vyzdvihnout i vynikající zákaznický servis. Tým je vždy připraven pomoci a rychle reaguje na jakékoli dotazy nebo problémy.",
            actor: "Matěj Odborný"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 20000);

        return () => clearInterval(interval);
    }, [items.length]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    return (
        <section className="main-review">
            <div id="scroll-reviews"></div>
            <div className="review-container">
                {items.map((item, index) => (
                    <div key={index} className={`review-item ${index === currentIndex ? "active" : ""}`}>
                        <img src={item.img} alt="Review"/>
                        <p>{item.text}</p>
                        <h4>{item.actor}</h4>
                    </div>
                ))}
            </div>
            <div className="review-buttons">
                <p id="prevR" onClick={handlePrev}></p>
                <p id="nextR" onClick={handleNext}>NEXT</p>
            </div>
        </section>
    );
};

export default Reviews;
