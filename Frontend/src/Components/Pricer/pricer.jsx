import Button1 from "../Button1/button1.jsx";

const Pricer = () => {
    const plans = [
        { name: "Basic", price: 19, features: ["Přesné skenování", "Identifikace zboží", "Snadný přístup"] },
        { name: "Standard", price: 29, features: ["Přesné skenování", "Identifikace zboží", "Správa zásob", "Snadný přístup", "Generování reportů"] },
        { name: "Premium", price: 39, features: ["Přesné skenování", "Identifikace zboží", "Prioritní podpora", "Snadný přístup", "Generování reportů", "Správa zásob", "Rozšířená analytika"] }
    ];

    return (
        <section className="main-pricer">
            <div id="scroll-pricer"></div>
            <h2>Ceník</h2>
            <div className="container-pricer">
                {plans.map((plan, i) => (
                    <div key={i} className="pricer-item">
                        <h3>{plan.name}</h3>
                        <div className="price">
                            <h4>$</h4>
                            <h3>{plan.price}</h3>
                            <h5>/ month</h5>
                        </div>
                        <div className="pricer-properties">
                            {plan.features.map((feature, index) => (
                                <p key={index}>{feature}</p>
                            ))}
                        </div>
                        <Button1 text={"Koupit"} odkaz={"/"}/>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricer;
