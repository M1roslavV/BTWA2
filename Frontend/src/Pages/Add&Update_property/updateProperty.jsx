
import { useState, useEffect } from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import AppLayout from "../../Components/App_layout/appLayout.jsx";
import PropertyForm from "../../Components/Form_add_update/formAddUpdate.jsx";

const UpdateProperty = () => {
    const [property, setProperty] = useState({
        inventoryNumber: "",
        name: "",
        responsiblePeople: "",
        price: "",
        category: "",
        location: "",
    });

    const location = useLocation();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState("");
    const [images, setImages] = useState([]);
    const [invoice, setInvoice] = useState("");
    const [error, setError] = useState("");
    const { id } = useParams();

    const fetchPropertyData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/properties/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProperty(data);
                setProfileImage(data.profileImage ? URL.createObjectURL(data.profileImage) : "");
                setImages(data.images ? data.images.map((img) => URL.createObjectURL(img)) : []);
                setInvoice(data.invoice ? URL.createObjectURL(data.invoice) : "");
            } else {
                setError("Chyba při načítání dat");
            }
        } catch (error) {
            setError(`Chyba při načítání dat: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchPropertyData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("propertyDto", new Blob([JSON.stringify(property)], { type: "application/json" }));
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }
        if (invoice) {
            formData.append("invoice", invoice);
        }
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append("images", image);
            });
        }
        
        try {
            const response = await fetch(`http://localhost:8080/api/properties/${id}`, {
                method: "PUT", // PUT pro aktualizaci
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Přidání tokenu
                },
                body: formData,
            });
            if (response.ok) {
                const previousPath = location.state?.from;
                navigate(previousPath);
            } else {
                const errorMessage = await response.text();
                setError(`Chyba serveru: ${errorMessage}`);
            }
        } catch (error) {
            setError(`Chyba při odesílání formuláře: ${error.message}`);
        }
    };

    return (
        <AppLayout>
            <PropertyForm
                headline={"Upravit nemovitost"}
                property={property}
                setProperty={setProperty}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                images={images}
                setImages={setImages}
                invoice={invoice}
                setInvoice={setInvoice}
                handleSubmit={handleSubmit}
                error={error}
            />
        </AppLayout>
    );
};

export default UpdateProperty;
