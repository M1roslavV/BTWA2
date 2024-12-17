import i_mobile from "../../images/i_mobile.png"
import i_diamond from "../../images/i_diamond.png"
import i_idea from "../../images/i_idea.png"
import i_strategy from "../../images/i_strategy.png"

const Features = () => {

    const items = [
        {img_path: i_mobile, nadpis: "Na všechna zařízení", text: "Lorem ipsum dolor eletum nulla eu placerat felis etiam tincidunt tiam tincidunt orci lacus id varius dolor fermum sit amet." },
        {img_path: i_diamond, nadpis: "Rychlé provedení", text: "Lorem ipsum dolor eletum nulla eu placerat felis etiam tincidunt tiam tincidunt orci lacus id varius dolor fermum sit amet." },
        {img_path: i_idea, nadpis: "Inspirativní nápady", text: "Lorem ipsum dolor eletum nulla eu placerat felis etiam tincidunt tiam tincidunt orci lacus id varius dolor fermum sit amet." },
        {img_path: i_strategy, nadpis: "Rostoucí strategie", text: "Lorem ipsum dolor eletum nulla eu placerat felis etiam tincidunt tiam tincidunt orci lacus id varius dolor fermum sit amet." }


    ];


    return (
        <div className="cards">
            {
                items.map((typ, index) => (
                    <div key={index} className="card">
                        <img src={typ.img_path} className="card-img-top"/>
                        <div className="card-body">
                            <h5>{typ.nadpis}</h5>
                            <p>{typ.text}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
export default Features;