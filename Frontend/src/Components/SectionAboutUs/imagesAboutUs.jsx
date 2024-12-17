import img1 from "../../images/aboutUs_team.png";
import img2 from "../../images/aboutUs_women.png";
import img3 from "../../images/aboutUs_men.png";

const ImagesAboutUs = () =>{
    return (
        <div className="aboutUs-images">
            <img src={img1} alt=""/>
            <img src={img2} alt=""/>
            <img src={img3} alt=""/>
        </div>
    )
}
export default ImagesAboutUs;